const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');
const awsHttpClient = require('http-aws-es');

export class ElasticSearchConnector {

    constructor(host, region, accessKeyId, secretAccessKey) {
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

    esGetSearchResults(searchIndex, searchQuery) {
        return this.client.search({
            index: searchIndex,
            body: JSON.stringify(searchQuery)
        });
    }

}