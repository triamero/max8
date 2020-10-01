const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const minifyJson = require("node-json-minify");
const WritePlugin = require("write-file-webpack-plugin");

module.exports = {

    entry: {
        app: ["./src/main.ts"]
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        plugins: [
            new TsconfigPathsPlugin({configFile: "tsconfig.json"})
        ]
    },

    module: {
        rules: [
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new CopyPlugin([
            {
                // Minify json files
                from: "*.json",
                context: "data",
                to: "[name].json",
                transform(content, path) {
                    return minifyJson(content.toString());
                }
            },
            {
                // Will resolve to RepoDir/libs
                from: "libs",
                // Copies all files from above dest to dist/
                to: "./"
            }
        ]),
        new WritePlugin({
            test: function (path) {
                path = path.toLowerCase();
                return path.endsWith(".json") || path.endsWith(".js");
            }
        })
    ]
};
