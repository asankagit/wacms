const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const dist = path.resolve(__dirname, "dist");
var webpack = require("webpack");
const fetch = require("node-fetch")
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// run terminal commands after each build 
const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');
// or 
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: "Logger",
  entry: { wasmer_host_function: "./worker_tmp.js" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].generated.js",
    libraryTarget: "commonjs2"
  },
  target: "node",
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals(
    // { allowlist: ['node-fetch']}
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
    rules: []
  },
  experiments: {
    asyncWebAssembly: true
  },
  resolve: {
    modules: [path.resolve(__dirname, '../../node_modules'), './src/utils']
  },
  // resolve: {
  //   alias: {
  //     fetch: path.resolve(__dirname, '../../node_modules/node-fetch')
     
  //   }
  // },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "*.wasm", to: path.resolve(__dirname, "dist/[name].wasm")}
      ]
    }),
    new webpack.ProvidePlugin({
      'fetch': ['node-fetch', 'default'],
      'ASM_JS': path.resolve(__dirname, './emscripten_mini.js')
    })
  ]
}