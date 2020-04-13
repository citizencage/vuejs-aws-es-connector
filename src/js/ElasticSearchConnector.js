const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');
const awsHttpClient = require('http-aws-es');

export class ElasticSearchConnector {

    constructor(host, region, accessKeyId, secretAccessKey) {

        // construct query object using multi_match search type
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
        this._queryObjMultiMatch = {
            query: {
                multi_match: {
                    query: '',
                    fields: []
                }
            }
        };

        // construct query object using simple query string search type
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html
        this._queryObjString = {
          query: {
              simple_query_string: {
                  query: '',
                  fields: []
              }
          }
        };

        // construct query object using query and filter context
        // https://www.elastic.co/guide/en/elasticsearch/reference/7.6/query-filter-context.html
        this._boolObjMatch = {
          query: {
              bool: {
                  must: {
                      multi_match: {
                          query: '',
                          fields: []
                      }
                  },
                  filter: {

                  }
              }
          }
        };

        this._explain = false;

        this._from = 0;

        this._size = 20;

        this.options = {
            hosts: [host],
            connectionClass: awsHttpClient,
            httpOptions: {},
            awsConfig: new AWS.Config({
                credentials: new AWS.Credentials(accessKeyId, secretAccessKey),
                region: region
            })
        };

        this.client = elasticsearch.Client(this.options);
    }

    set queryFields(fields) {
        this._fields = fields;
    }

    get queryFields() {
        return this._fields;
    }

    set queryExplain(explain) {
        this._explain = explain;
    }

    get queryExplain() {
        return this._explain;
    }

    set queryFrom(from) {
        this._from = from;
    }

    get queryFrom() {
        return this._from;
    }

    set querySize(size) {
        this._size = size;
    }

    get querySize() {
        return this._size;
    }

    /*
    // 'term' and 'range' clauses are used in filter context.
    // example clause: { "publish_date": { "gte": "2015-01-01" }}
     */
    set filterCondition(object) {
        this._filterCondition = object;
    }

    get filterCondition() {
        return this._filterCondition;
    }



    esGetSearchResults(searchIndex, searchQuery, searchType) {
        let searchBody;
        if(searchType === 'multi_match') {
            this._esUpdateMultiMatchQueryDSL(searchQuery);
            searchBody = this._queryObjMultiMatch;
        } else if (searchType === 'bool') {
            this._esUpdateBoolObjMatchQueryDSL(searchQuery);
            searchBody = this._boolObjMatch;
            console.log(searchBody);
        } else {
            // query_string
            this._esUpdateObjStringQueryDSL(searchQuery);
            searchBody = this._queryObjString;
        }
        return this._executeSearch(searchIndex, searchBody);
    }



    _esUpdateMultiMatchQueryDSL(searchQuery) {
        this._queryObjMultiMatch.query.multi_match.query = searchQuery;
        this._queryObjMultiMatch.query.multi_match.fields = this._fields;
    }

    _esUpdateObjStringQueryDSL(searchQuery) {
        this._queryObjString.query.simple_query_string.query = searchQuery;
        this._queryObjString.query.simple_query_string.fields = this._fields;
    }

    _esUpdateBoolObjMatchQueryDSL(searchQuery) {
        this._boolObjMatch.query.bool.must.multi_match.query = searchQuery;
        this._boolObjMatch.query.bool.must.multi_match.fields = this._fields;
        this._boolObjMatch.query.bool.filter = this._filterCondition;
    }

    _executeSearch(searchIndex, searchBody) {
        return this.client.search({
            index: searchIndex,
            explain: this._explain,
            from: this._from,
            size: this._size,
            body: JSON.stringify(searchBody)
        });
    }

}