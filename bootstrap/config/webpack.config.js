const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

module.exports = {
  mode: 'production',
  entry: {
    bootstrap: './src/Bootstrap.js',
    test: './src/test.js',
    vendors: ['react', 'react-dom'],
  },
  output: {
    publicPath: '',
    // filename: 'Bootstrap.[hash:5].js',
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'build'),
  },
  optimization: {
    minimize: false,

    splitChunks: {
      // chunks: "all",
      // name: false
      cacheGroups: {
        // vendors: {
        //   // 基本框架
        //   chunks: 'all',
        //   test: /(react|react-dom|react-router-dom|@babel\/polyfill|redux|react-redux|react-loadable)/,
        //   priority: 100,
        //   name: 'vendors',
        // },
        'async-commons': {
          // 其余异步加载包
          chunks: 'async',
          minChunks: 2,
          name: 'async-commons',
          priority: 90,
        },
        commons: {
          // 其余同步加载包
          // chunks: 'all',
          chunks: function(chunk) {
            console.log(chunk.name, '001010');
            // 这里的name 可以参考在使用`webpack-ant-icon-loader`时指定的`chunkName`
            return chunk.name !== 'antd-icons';
          },
          minChunks: 2,
          name: 'commons',
          priority: 80,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                loose: true,
                modules: false,
                targets: {
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'ie >= 9',
                    'iOS >= 8',
                    'Android >= 4',
                  ],
                },
              },
            ],
            ['react-app'],
          ],
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
    new MergeIntoSingleFilePlugin({
      files: {
        'vendors.js': [
          'node_modules/react/umd/react.production.min.js',
          'node_modules/react-dom/umd/react-dom.production.min.js',
          'node_modules/systemjs/dist/system.min.js',
          'node_modules/systemjs/dist/extras/amd.min.js',
          'node_modules/systemjs/dist/extras/use-default.min.js',
          
        ],
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'src/index.html'),
      // inlineSource: 'bootstrap.(js)$',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    // new CopyWebpackPlugin([{ from: path.resolve(__dirname, '..', 'src/index.html') }]),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['build'] }),
  ],
  devtool: 'source-map',
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  ],
};
