const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

// common config
module.exports = {
    // https://webpack.js.org/concepts/entry-points/#multi-page-application
    entry: {
        index: './src/js/index.js'
    },

    // https://webpack.js.org/concepts/loaders/
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                }
            }
        ]
    },

    // resolve: documentation
    // https://webpack.js.org/configuration/resolve/
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            Components: path.resolve(__dirname, 'src/js/components/')
        },
        modules: [
            path.resolve(__dirname, 'src/js'),
            path.resolve(__dirname, 'src'),
            'node_modules'
        ],
        extensions: ['*', '.js', '.vue', '.json']
    },

    plugins: [

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),

        new CopyPlugin([
            {from:'src/images',to:'images'}
        ]),

        new VueLoaderPlugin()

    ]
};
