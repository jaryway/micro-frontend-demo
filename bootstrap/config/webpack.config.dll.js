const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    dll: ['systemjs/dist/system', 'systemjs/dist/extras/amd', 'systemjs/dist/extras/use-default'],
  },
  output: {
    // publicPath: '',
    // // filename: 'Bootstrap.[hash:5].js',
    // filename: 'bootstrap.js',
    // path: path.resolve(__dirname, '..', 'build'),

    path: path.join(__dirname, '..', 'dist', 'dll'),
    filename: 'Dll.js',
    library: '[name]_[hash]',
  },
  optimization: {
    minimize: false,
  },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.js?$/,
  //         exclude: [path.resolve(__dirname, 'node_modules')],
  //         loader: require.resolve('babel-loader'),
  //         options: {
  //           presets: ['@babel/preset-env'],
  //         },
  //       },
  //     ],
  //   },
  //   node: {
  //     fs: 'empty',
  //   },
  //   resolve: {
  //     modules: [__dirname, 'node_modules'],
  //   },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '..', 'dist', 'dll', 'manifest.json'),
      name: '[name]_[hash]',
      context: __dirname,
    }),
  ],
  devtool: 'source-map',
  externals: [],
};
