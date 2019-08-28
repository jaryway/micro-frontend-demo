import React from 'react';
import uuidv4 from 'uuid/v4';

export default ({}) => {
  console.log('sub-module is loaded');
  return (
    <div id='sub-module'>
      <ol>
        <li>{uuidv4()}</li>
        <li>你或你的团队编写的源码。</li>
        <li>你的源码会依赖的任何第三方的 library 或 "vendor" 代码。</li>
        <li>
          webpack 的 runtime 和 <em>manifest</em>，管理所有模块的交互。
        </li>
      </ol>
    </div>
  );
};
