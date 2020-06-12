const { createProxyMiddleware } = require('http-proxy-middleware');

const deployAppsProxy = {
  '/app-homepage': { target: 'http://localhost:3812/', pathRewrite: { '^/app-homepage': '' } },
  '/app-sub1': { target: 'http://localhost:3702/', pathRewrite: { '^/app-sub1': '' } },
  '/app-sub2': { target: 'http://localhost:3703/', pathRewrite: { '^/app-sub2': '' } },
};

module.exports = function (app) {
  console.log('setupProxy');
  Object.entries(deployAppsProxy).forEach(([k, v]) => {
    app.use(
      k,
      createProxyMiddleware(v)
      //   createProxyMiddleware({
      //     target: 'http://localhost:5000',
      //     changeOrigin: true,
      //   })
    );
  });
};
