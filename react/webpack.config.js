var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = [{
        entry: {
            index: "./index.js",
        },
        output: {
            path: "../static/js/",
            filename: "[name].js"
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "react"]
                }
            }, {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?.*)?$/,
                loader: 'url?limit=50000'
            }]
        },
        resolve: {
            extensions: ["", ".js", ".json"]
        },
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery",
                jquery: "jquery"
            })
        ]
    }, {
        entry: {
            style: "./less/style.less"
        },
        output: {
            path: "../static/css/",
            filename: "[name].css"
        },
        module: {
            loaders: [
                // Extract css files
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader")
                },
                // Optionally extract less files
                // or any other compile-to-css language
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
                },

                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?.*)?$/,
                    loader: 'url?limit=50000'
                }
            ]
        },
        resolve: {
            extensions: ["", ".js"]
        },
        plugins: [
            new ExtractTextPlugin("[name].css")
        ]
    }

];
