const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const minifyJson = require("node-json-minify");

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
            },
            { // For shaders
                test: [/\.vert$/, /\.frag$/],
                use: "raw-loader"
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new webpack.NamedModulesPlugin(),
        new CopyWebpackPlugin([
            {
                // Will resolve to RepoDir/src/assets
                from: "assets",

                // Copies all files from above dest to dist/
                to: "./",

                // Minify json files
                transform(content, path) {
                    if (!path.toLowerCase().endsWith(".json")) {
                        return Promise.resolve(content);
                    }
                    return minifyJson(content.toString());
                }
            }
        ])
    ]
};
