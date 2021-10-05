const webpack = require("webpack");
const { merge } = require('webpack-merge');
const common = require("./webpack.config");
const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");

const plugins = [
    new webpack.HotModuleReplacementPlugin()
];

module.exports = merge(common, {

    mode: "development",
    plugins: plugins.concat(new NodemonPlugin({
        nodeArgs: ["--inspect=0.0.0.0:3004", ["--experimental-worker --experimental-wasi-unstable-preview1 --experimental-vm-modules"]]
    }))

});
