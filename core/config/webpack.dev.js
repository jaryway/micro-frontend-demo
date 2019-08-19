/**
 * webpackFactory 这种方式无法直接用 webpack-cli 直接运行 这里做一个转换
 * 可以通过添加参数 --modules 配置要编译的项目。如： --modules main,mobile,forms,flows
 * 不配置 --modules 参数，默认 值编译 main 项目
 */
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// const processArgvs = process.argv.slice(2);

// const modules = [];
// if (processArgvs.includes("--modules")) {
//   process.argv.splice(processArgvs.indexOf("--modules"), 2);
//   modules.push(...`${processArgvs[processArgvs.indexOf("--modules") + 1]}`.split(","));
// }

// if (!modules.length) modules.push("main");
// // console.log("ddddddddddddddddd");
// const mainConfig = require("../config/webpack.config")("development");
// const mobileConfig = require("../config/mobile.config")("development");
// const formsConfig = require("../config/forms.config")("development");
// const flowsConfig = require("../config/flows.config")("development");

// const config = [mainConfig, mobileConfig, formsConfig, flowsConfig].filter(m =>
//   modules.includes(m.name)
// );

module.exports = require('../config/webpack.config')('development');
