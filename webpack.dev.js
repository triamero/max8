const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    mode: "development",

    devServer: {
        publicPath: "/",
        contentBase: "./",
        hot: true,
        watchContentBase: true,
        compress: false,
        port: 4201,
        writeToDisk: true
    },

    watchOptions: {
        ignored: ["node_modules"],
        poll: 1000
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    }
});
