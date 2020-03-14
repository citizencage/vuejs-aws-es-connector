# vuejs-aws-es-connector
AWS Elasticsearch Connection Library for VueJS

Author: Rusty Cage

This repo contains a custom library for connecting a VueJS application to an Elasticsearch container running on AWS. 

The Javascript connection class presupposes that the Elasticsearch container is secured with a [Resource-based](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-ac.html#es-ac-types-resource) Policy that limits access by a [Principal](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html) element.

A reasonable understanding of the following AWS concepts is necessary to instantiate a successful connection to an Elasticsearch (Amazon ES) container:

- AWS Identity and Access Management [(IAM)](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) - a web service that helps you securely control access to AWS resources
- Amazon ES [overview](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/what-is-amazon-elasticsearch-service.html)
- Creating and configuring an ES [container](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createupdatedomains.html)
- [Identity and Access Management](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-ac.html) 
- Signing [HTTP Requests](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-request-signing.html) which this Javascript connection library simplifies

## Requirements

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/get-npm)

## Project Dependencies

_Note: all project dependencies are listed in the package.json file, but the following packages, which pertain to signing HTTP Requests, are worth highlighting:_

- [AWS SDK for JavaScript](https://www.npmjs.com/package/aws-sdk)
- [HTTP-AWS-ES](Connection handler for Amazon ES) uses the aws-sdk to make signed requests to an Amazon ES endpoint.

## Configuration

Download the code or pull from GIT. Within your project root, open your command line and run:

```bash
npm install
```

Open both the the `webpack.dev.js` and `webpack.prod.js` files and modify the AWS ES container host, region and credentials (AWS_HOST, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) in accordance with your own working instance. These process environments are instantiated at run-time within the VueJS application provided in this repo.

To start the webpack dev server and reload the application in your web browser, run the following command:

```bash
npm run start
``` 

To buiild a production-ready application (sass is compiled into a minified css, javascript is uglified and all src files are copied to the `dist` folder), run:

```bash
npm run build
``` 

Additionally, you can preview the production-ready bundle in your web browser by running:

```bash
npm run preview
``` 

### Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

### Credits

- [Mattias Severson](https://github.com/matsev) who wrote an easy-to-understand [blog](https://blog.jayway.com/2018/09/11/aws-elasticsearch-javascript-client/) on signing HTTP requests on AWS, the inspiration for this repo.
- [Geoff Wagstaff](https://github.com/TheDeveloper) for creating the elasticsearch-js client for Amazon ES 

### License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.