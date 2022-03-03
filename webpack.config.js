const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack")

module.exports = {
    entry: './src/index.js',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'dots',
            template: 'src/index.html',
        }),
        // new webpack.HotModuleReplacementPlugin(),
        new Dotenv()
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: "/dist/",
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist/"),
            //publicPath: "http://localhost:3000/dist/",
        },
        port: 3000,
        hot: "only",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },

};