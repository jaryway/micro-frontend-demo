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
    main: './src/Bootstrap.js',
  },
  output: {
    publicPath: '',
    // filename: 'Bootstrap.[hash:5].js',
    filename: 'bootstrap.js',
    path: path.resolve(__dirname, '..', 'build'),
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'src/index.html'),
      inlineSource: '.(js)$',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    // new CopyWebpackPlugin([{ from: path.resolve(__dirname, '..', 'src/index.html') }]),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['build'] }),
  ],
  devtool: 'source-map',
  externals: [],
};
