const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');
const awsHttpClient = require('http-aws-es');

export class ElasticSearchConnector {

    constructor(host, region, accessKeyId, secretAccessKey) {

        // construct query object using multi_match search type
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
        this.queryObjMultiMatch = {
            query: {
                multi_match: {
                    query: '',
                    fields: []
                }
            }
        };

        // construct query object using simple query string search type
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html
        this.queryObjString = {
          query: {
              simple_query_string: {
                  query: '',
                  fields: []
              }
          }
        };

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


    esGetSearchResults(searchIndex, searchQuery, searchType) {
        if(searchType === 'multi_match') {
            this.esUpdateMultiMatchQueryDSL(searchQuery);
            return this.client.search({
                index: searchIndex,
                body: JSON.stringify(this.queryObjMultiMatch)
            });
        } else {
            // query_string
            this.esUpdateStringQueryDSL(searchQuery);
            return this.client.search({
                index: searchIndex,
                body: JSON.stringify(this.queryObjString)
            });
        }
    }



    esUpdateMultiMatchQueryDSL(searchQuery) {
        this.queryObjMultiMatch.query.multi_match.query = searchQuery;
        this.queryObjMultiMatch.query.multi_match.fields = this._fields;
    }

    esUpdateStringQueryDSL(searchQuery) {
        this.queryObjString.query.simple_query_string.query = searchQuery;
        this.queryObjString.query.simple_query_string.fields = this._fields;
    }

}