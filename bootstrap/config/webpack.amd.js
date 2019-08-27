const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HelloWorldPlugin = require('./hello-world-plugin');
// const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

module.exports = {
  mode: 'production',
  //   entry: {
  //     // bootstrap: './src/Bootstrap.js',
  //     // test: './src/test.js',
  //     // vendors: ['react', 'react-dom'],

  //   },

  entry: {
    react: ['react'],
    'react-dom': 'react-dom',
    'react-router-dom': 'react-router-dom',
    history: 'history',
    // test: './src/test.js',
  },
  output: {
    publicPath: '',
    // filename: 'Bootstrap.[hash:5].js',
    libraryTarget: 'amd',
    library: '[name]',
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'build'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
    ],

    // splitChunks: {
    //   // chunks: "all",
    //   // name: false
    //   cacheGroups: {
    //     vendors: {
    //       // 基本框架
    //       chunks: 'all',
    //       test: /(react|react-dom|react-router-dom|@babel\/polyfill|redux|react-redux|react-loadable)/,
    //       priority: 100,
    //       name: 'vendors',
    //     },
    //     'async-commons': {
    //       // 其余异步加载包
    //       chunks: 'async',
    //       minChunks: 2,
    //       name: 'async-commons',
    //       priority: 90,
    //     },
    //     commons: {
    //       // 其余同步加载包
    //       // chunks: 'all',
    //       chunks: function(chunk) {
    //         // console.log(chunk.name, '001010');
    //         // 这里的name 可以参考在使用`webpack-ant-icon-loader`时指定的`chunkName`
    //         return chunk.name !== 'antd-icons';
    //       },
    //       minChunks: 2,
    //       name: 'commons',
    //       priority: 80,
    //     },
    //   },
    // },
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
    new HelloWorldPlugin(),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '..', 'src/index.html'),
    //   // inlineSource: 'bootstrap.(js)$',
    // }),
    // new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '..', 'public/project.config.json') }]),
    // new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [ path.resolve(__dirname, '..', 'build')] }),
  ],
  //   devtool: 'source-map',
  devtool: 'none',
  externals: [
    // {
    //   react: 'react',
    //   'react-dom': 'react-dom',
    //   'react-router-dom': 'react-router-dom',
    //   history: 'history',
    //   'prop-types': 'prop-types',
    //   redux: 'redux',
    //   'react-redux': 'react-redux',
    //   'single-spa': 'single-spa',
    // },
  ],
};
