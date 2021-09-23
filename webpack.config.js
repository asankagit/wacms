const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const dist = path.resolve(__dirname, "dist");

const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// run terminal commands after each build 
const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');
// or 
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
  entry: "./src/tmp/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  target: "node",
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
      // Emscripten JS files define a global. With `exports-loader` we can 
      // load these files correctly (provided the global’s name is the same
      // as the file name).
      //   {
      //     test: /fibonacci\.js$/,
      //     loader: "exports-loader"
      //   },
      // wasm files should not be processed but just be emitted and we want
      // to have their public URL.
      // {
      //   test: /.wasm$/,
      //   type: "javascript/auto",
      //   loader: "file-loader",
      //   options: {
      //     publicPath: "dist/"
      //   },
      // },
      // { test: /\.(wasm|jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file-loader" }
    ]
  },
  plugins: [
    new HookShellScriptPlugin({
      afterEmit: ['clear']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/tmp/*.wasm", to: path.resolve(__dirname, "dist/[name].wasm")}
      ]
    }),
    new WebpackShellPluginNext({
      onBuildStart:{
        scripts: ['echo "===> Starting packing with WEBPACK 5"'],
        blocking: true,
        parallel: false
      },
      onBuildEnd:{
        scripts: ['echo "===> Build sucess"'],
        blocking: false,
        parallel: true
      }
    })
  ],
  experiments: {
    asyncWebAssembly: true
  },

}