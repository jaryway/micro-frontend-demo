const path = require('path');
// const webpack = require("webpack");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
// const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const paths = require('./paths');
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// const isEnvDevelopment = webpackEnv === 'development';
const isEnvProduction = true;

module.exports = {
  mode: 'production',
  entry: {
    bootstrap: [path.resolve(__dirname, '..', 'src/bootstrap')],
  },
  output: {
    publicPath: '',
    // filename: 'Bootstrap.[hash:5].js',
    filename: 'bootstrap.js',
    path: path.resolve(__dirname,'..', 'build'),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
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
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          chunks: ['bootstrap'],
          template: paths.appHtml,
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/bootstrap.js/]),
    // CopyWebpackPlugin([{ from: path.resolve(__dirname, "src/index.html") }]),
    // new CleanWebpackPlugin(["build"])
  ],
  devtool: 'source-map',
  externals: [],
};
