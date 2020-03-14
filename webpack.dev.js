const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {

    mode: 'development',
    stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        // our additional options
        moduleTrace: true,
        errorDetails: true
    },

    // This option controls if and how source maps are generated.
    // https://webpack.js.org/configuration/devtool/
    devtool: 'eval-cheap-module-source-map',

    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        port: 8080,
        writeToDisk: false // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
    },

    module: {

        // loaders will get concatenated!

        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        // creates style nodes from JS strings
                        loader: "style-loader"
                    },
                    {
                        // translates CSS into CommonJS
                        loader: "css-loader"
                    },
                    {
                        // compiles Sass to CSS
                        loader: "sass-loader"
                    }
                ]
            },
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // On development we want to see where the file is coming from, hence we preserve the [path]
                            name: '[path][name].[ext]?hash=[hash:20]',
                            esModule: false,
                            limit: 8192
                        }
                    }
                ]
            }
        ]

    },

    // https://webpack.js.org/concepts/plugins/
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"',
                'AWS_HOST': JSON.stringify('https://search-esdemo-vcchn4a5s3gzw6lbsyqgy4s7em.us-east-2.es.amazonaws.com'),
                'AWS_REGION': JSON.stringify('us-east-2'),
                'AWS_ACCESS_KEY_ID': JSON.stringify('AKIAQOY5HXXWX5MXFKHV'),
                'AWS_SECRET_ACCESS_KEY': JSON.stringify('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'),
            },

            PRODUCTION: JSON.stringify(false)
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        })
    ]

});