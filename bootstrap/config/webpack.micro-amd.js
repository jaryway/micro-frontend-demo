const fs = require('fs');
const path = require('path');
const isWsl = require('is-wsl');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

const deployAppsProxy = {
  '/app-base': { target: 'http://localhost:3701/', pathRewrite: { '^/app-base': '' } },
  '/app-sub1': { target: 'http://localhost:3702/', pathRewrite: { '^/app-sub1': '' } },
  '/app-sub2': { target: 'http://localhost:3703/', pathRewrite: { '^/app-sub2': '' } },
};
console.log(process.env.NODE_ENV);

module.exports = {
  mode: isEnvProduction ? 'production' : isEnvDevelopment ? 'development' : 'none',
  // devtool: 'source-map',
  devtool: isEnvProduction ? false : isEnvDevelopment && 'cheap-module-source-map',
  entry: {
    bootstrap: ['@babel/polyfill', './src/index.ts'],
  },
  output: {
    publicPath: '/',
    filename: 'Bootstrap.[hash:5].js',
    libraryTarget: 'amd',
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'build'),
  },
  devServer: {
    contentBase: './public',
    port: 3700,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
    },
    proxy: {
      ...deployAppsProxy,
    },
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: isEnvProduction,
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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: false,
          title: 'MICRO_FRONTEND_DEMO',
          template: path.resolve(__dirname, '..', 'src/index.ejs'),
          loading: { html: fs.readFileSync(path.join(__dirname, './loading.html')) },
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
    isEnvProduction &&
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '..', 'public/**/*'),
          transformPath(targetPath) {
            return targetPath.replace('public', '');
          },
        },
      ]),
    isEnvProduction &&
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '..', 'build')],
      }),
  ].filter(Boolean),

  externals: [
    {
      'react': 'react',
      'react-dom': 'react-dom',
      'react-router-dom': 'react-router-dom',
      'redux': 'redux',
      'redux-thunk': 'redux-thunk',
      'react-redux': 'react-redux',
      'redux-promise-middleware': 'redux-promise-middleware',
      'single-spa': 'single-spa',
      'single-spa-react': 'single-spa-react',
      'history': 'history',
      'prop-types': 'prop-types',
    },
  ],
};
