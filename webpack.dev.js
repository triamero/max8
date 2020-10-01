const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",

    devServer: {
        publicPath: "/",
        contentBase: "./",
        hot: true,
        watchContentBase: true,
        compress: false,
        port: 4201
    },

    watchOptions: {
        ignored: ["node_modules"],
        poll: 1000
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },

    plugins: [
        new HtmlPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
            inject: "body",
        })
    ]
});
