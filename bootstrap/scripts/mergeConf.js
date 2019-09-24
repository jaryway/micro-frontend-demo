const fs = require('fs');
const path = require('path');
// 找到以 -app 结尾的文件夹

// 提取里面的 project.json，并写入 project.config.json 中
console.log('__dirname', __dirname);
const rootPath = path.join(__dirname, '..', 'public');
fs.readdir(rootPath, function(err, files) {
  if (err) throw err;
  console.log('files', files);

  const appDirList = files
    .map(m => path.join(rootPath, m))
    .filter(m => {
      // const absolutePath = path.join(rootPath, m);
      return fs.statSync(m).isDirectory();
    });

  const projects = appDirList.map(m => {
    const filename = path.join(m, 'project.json');
    return JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));
  });
  const configFilename = path.join(rootPath, 'project.config.json');
  let configContent = fs.readFileSync(configFilename, {
    encoding: 'utf8',
  });
  let config = { ...JSON.parse(configContent), projects };

  fs.writeFile(configFilename, JSON.stringify(config), err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  console.log('constentList', JSON.stringify(config));
});
