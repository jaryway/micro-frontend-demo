const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = {
  mode: 'production',
  entry: {
    libs: [
      // './src/test.js'
      './src/lib.js',
      // 'systemjs/dist/system',
      // 'systemjs/dist/extras/amd',
      // 'systemjs/dist/extras/use-default',
    ],
  },
  output: {
    path: path.join(__dirname, '..', 'build', 'libs'),
    filename: 'test.js',
    // libraryTarget: 'umd',
    // library: 'sysJS',
  },
  optimization: {
    minimize: false,
  },
  // module: {
  //   rules: [
  //     {
  //       test: /.js/,
  //       use: [
  //         {
  //           loader: `expose-loader`,
  //           options: 'System',
  //         },
  //       ],
  //     },
  //   ],
  // },
  externals: {
    // 'system.min':'system',
    // react: "react",
    // "react-dom": "react-dom",
    // "react-router-dom": "react-router-dom",
    // "@babel/polyfill": "@babel/polyfill",
    // redux: "redux",
    // "react-redux": "react-redux",
    // "react-loadable": "react-loadable"
  },
  plugins: [
    new MergeIntoSingleFilePlugin({
      files: {
        'system.js': [
          'node_modules/systemjs/dist/system.min.js',
          'node_modules/systemjs/dist/extras/amd.min.js',
          'node_modules/systemjs/dist/extras/use-default.min.js',
        ],
      },
    }),
    // new webpack.ProvidePlugin({
    //   'window.System': 'System'
    // })
    //     new webpack.DllPlugin({
    //       path: path.join(__dirname, '..', 'dist', 'dll', 'manifest.json'),
    //       name: '[name]_[hash]',
    //       context: __dirname,
    //     }),
  ],
  devtool: 'source-map',
  externals: [],
};
