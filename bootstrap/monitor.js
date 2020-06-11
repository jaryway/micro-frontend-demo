const fs = require('fs');
const chokidar = require('chokidar');
const rootDir = './build';
// One-liner for current directory
chokidar.watch(rootDir, { depth: 1, ignored: '*.js' }).on('all', (event, path) => {
  console.log(event, path);

  switch (event) {
    // 添加文件
    case 'add':
      if (path.endsWith('project.json')) mergeConfig();
      break;
    case 'addDir':
      if (path.endsWith('-app')) mergeConfig();
      break;
    case 'unlinkDir':
      if (path.endsWith('-app')) mergeConfig();
      break;
    case 'unlink':
      if (path.endsWith('project.json')) mergeConfig();
      break;
    case 'change':
      if (path.endsWith('-app') || path.endsWith('project.json')) mergeConfig();
      break;
    default:
      break;
  }
});

let timerId;

function mergeConfig(msg) {
  clearTimeout(timerId);
  timerId = setTimeout(_runMerge, 50, msg);
}

function _runMerge() {
  // console.log('_runMerge', msg);
  // return;
  const projects = fs
    .readdirSync(rootDir)
    .filter(m => fs.statSync(`${rootDir}/${m}`).isDirectory() && m.endsWith('-app'))
    .map(m => {
      try {
        return JSON.parse(fs.readFileSync(`${rootDir}/${m}/project.json`, { encoding: 'utf8' }));
      } catch (error) {
        return false;
      }
    })
    .filter(Boolean);

  // const config = { projects };
  const content = `define([], function() {'use strict';return ${JSON.stringify({ projects })}})`;

  fs.writeFile(`${rootDir}/project.config.js`, content, err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}
