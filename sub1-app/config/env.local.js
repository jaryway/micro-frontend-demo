// const { icons } = require('../src/assets/fonts/selection.json');
const argvs = process.argv.slice(2); // 得到 ['apiBaseUrl','http://192.168.0.200:31111' ,'iOfficeUrl','http://183.60.252.250:8666']
let apiBaseUrl = '""';
let iOfficeUrl = '""';
let loginPage = '""';
// const customIconNames = JSON.stringify(icons.map(({ properties: { name } }) => name));


if (argvs.includes("apiBaseUrl")) {
  apiBaseUrl = `"${argvs[argvs.indexOf("apiBaseUrl") + 1]}"`;
}

if (argvs.includes("iOfficeUrl")) {
  iOfficeUrl = `"${argvs[argvs.indexOf("iOfficeUrl") + 1]}"`;
}

if (argvs.includes("loginPage")) {
  loginPage = `"${argvs[argvs.indexOf("loginPage") + 1]}"`;
}

module.exports = {
  __API_BASE_URL__: apiBaseUrl,
  __IOFFICE_URL__: iOfficeUrl,
  __LOGIN_PAGE__: loginPage,
  // __CUSTOM_ICON_NAMES__: customIconNames,
  // MODULES: modules
}