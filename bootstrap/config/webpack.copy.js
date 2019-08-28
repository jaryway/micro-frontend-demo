const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {},
  plugins: [
    new CopyWebpackPlugin([
      ...[
        './node_modules/react/umd/react.production.min.js',
        './node_modules/react-dom/umd/react-dom.production.min.js',
        './node_modules/react-router-dom/umd/react-router-dom.min.js',
        './node_modules/prop-types/prop-types.min.js',
        './node_modules/history/umd/history.min.js',
        './node_modules/redux/dist/redux.min.js',
        './node_modules/react-redux/dist/react-redux.min.js',
        './node_modules/single-spa/lib/umd/single-spa.min.js',
      ].map(item => ({ from: item, to: 'common-vendors' })),
    ]),
  ],
};
