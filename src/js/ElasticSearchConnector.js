const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');
const awsHttpClient = require('http-aws-es');

export class ElasticSearchConnector {

    constructor(host, region, accessKeyId, secretAccessKey) {

        // construct query object using multi_match search type
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
        this.queryObj = {
            query: {
                multi_match: {
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

    esGetSearchResults(searchIndex, searchQuery) {
        this.esUpdateQueryDSL(searchQuery);
        return this.client.search({
            index: searchIndex,
            body: JSON.stringify(this.queryObj)
        });
    }

    esUpdateQueryDSL(searchQuery) {
        this.queryObj.query.multi_match.query = searchQuery;
        this.queryObj.query.multi_match.fields = this._fields;
    }

}