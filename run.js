/**
 * 把多个 import xxx from '@/components/xxx';
 * 替换成
 * import { xxx, xxx ...} from 'fregata';
 */

const fs = require('fs');

let content = fs.readFileSync('./test.js', { encoding: 'utf-8' });

const components = ['MainContainer', 'TableOperations', 'Col'];
const pattern = `import \\{([\\S ,]{0,})\\} from ('|")fregata('|");`;
const matchs = [];

components.forEach(ele => {
  const regExp = new RegExp(`import (${ele}) from '@/components/${ele}';\r?\n?`, 'g');

  content = content.replace(regExp, ($0, $1, ...rest) => {
    const [input] = rest.slice(-1);

    // 如果已经存在 import { xxx } from 'fregata'; 替换成空字符串
    if (new RegExp(pattern).test(input)) {
      matchs.push($1);
      return '';
    }

    return `import { ${$1} } from 'fregata';`;
  });
});

// 如果有未 import 的 fregata 组件，合并导入；
if (matchs.length) {
  content = content.replace(new RegExp(pattern), ($0, $1) => {
    const m = $1
      .trim()
      .split(',')
      .concat(matchs)
      .join(', ');

    return `import { ${m} } from 'fregata';`;
  });
}

console.log(content, matchs);
