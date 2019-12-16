const fs = require('fs');
const path = require('path');
const isWsl = require('is-wsl');
// const webpack = require('webpack');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

module.exports = {
  mode: 'production',
  entry: {
    // bootstrap: './src/Bootstrap.js',
    bootstrap: ['@babel/polyfill', './src/index.js'],
    // vendors: ['react', 'react-dom'],
  },
  output: {
    publicPath: '',
    // filename: 'Bootstrap.[hash:5].js',
    libraryTarget: 'amd',
    filename: '[name].js',
    library: 'bootstrap',
    path: path.resolve(__dirname, '..', 'build'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
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
            // Pending further investigation:
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
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: !isWsl,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
    ],
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'src/index.ejs'),
      inject: false,
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
      loading: { html: fs.readFileSync(path.join(__dirname, './loading.html')) },
      // inlineSource: 'bootstrap.(js)$',
    }),
    // new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([
      // { from: path.resolve(__dirname, '..', 'public/project.config.json') },
      {
        from: path.resolve(__dirname, '..', 'public/**/*'),
        transformPath(targetPath) {
          return targetPath.replace('public', '');
        },
      },
    ]),
    // new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [ path.resolve(__dirname, '..', 'build')] }),
  ],
  devtool: 'source-map',
  externals: [
    {
      'react': 'react',
      'react-dom': 'react-dom',
      'react-router-dom': 'react-router-dom',
      'history': 'history',
      'prop-types': 'prop-types',
      'redux': 'redux',
      'react-redux': 'react-redux',
      'single-spa': 'single-spa',
    },
  ],
};
