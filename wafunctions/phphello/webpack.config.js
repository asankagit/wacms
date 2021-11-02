const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const dist = path.resolve(__dirname, "dist");

const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// run terminal commands after each build 
const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');
// or 
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: "Logger",
    entry: { wasmer_host_function: "./worker.js" },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].generated.js",
        libraryTarget: "commonjs2"
    },
    target: "node",
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals(
        { allowlist: ['node-fetch'] }
    ), '@wasmer/wasi', '@wasmer/wasmfs', '@wasmer/wasm-transformer'],
    // include: ['@wasmer/wasi', '@wasmer/wasmfs'],
    watchOptions: {
        poll: 1000, // Check for changes every second
    },
    devServer: {
        port: "8090",
        hot: true,
    },
    mode: "development",
    module: {
        rules: [
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/*.php", to: path.resolve(__dirname, "dist/scripts/[name].php") }
            ]
        })
    ],
    experiments: {
        asyncWebAssembly: true
    },
    resolve: {
        modules: [path.resolve(__dirname, '../../node_modules'), './src/utils']
    }
}