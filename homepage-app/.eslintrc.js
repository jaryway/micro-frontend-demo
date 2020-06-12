/*
"off" or 0 - turn the rule off
"warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
"error" or 2 - turn the rule on as an error (exit code will be 1)
*/

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['airbnb', 'prettier', 'plugin:compat/recommended', 'plugin:import/typescript'],
  env: {
    browser: true,
    // "node": true,
    es6: true,
    // "mocha": true,
    // "jest": true,
    // "jasmine": true
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-continue': [1],
    'no-eval': [
      'warn',
      {
        allowIndirect: true,
      },
    ],
    'react/jsx-props-no-multi-spaces': [0],
    'generator-star-spacing': [0],
    'consistent-return': [0],
    'react/forbid-prop-types': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'global-require': [1],
    'import/prefer-default-export': [0],
    'react/jsx-no-bind': [0],
    'react/prop-types': [0],
    'react/prefer-stateless-function': [0],
    'no-else-return': [0],
    'no-restricted-syntax': [0],
    'import/no-extraneous-dependencies': [0],
    'no-use-before-define': [0],
    'jsx-a11y/no-static-element-interactions': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/anchor-is-valid': [0],
    'no-nested-ternary': [0],
    'arrow-body-style': [0],
    'import/extensions': [0],
    'no-bitwise': [0],
    'no-cond-assign': [0],
    'import/no-unresolved': [0],
    'object-curly-newline': [0],
    'function-paren-newline': [0],
    'no-restricted-globals': [0],
    'require-yield': [1],
    'compat/compat': [1],

    /*  自定义的*/
    // allow paren-less arrow functions
    'arrow-parens': [0],
    'indent': [0],
    // "indent": "off",
    'padded-blocks': [0],
    // allow async-await
    'generator-star-spacing': [0],
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': [0],
    'semi': [0],
    'eol-last': [0],
    // 引号风格
    'quotes': [0],
    // if 的风格
    'curly': [0],
    // 不能有多行空行
    'no-multiple-empty-lines': [0],
    'func-names': [0],
    // 不能以逗号结尾
    'comma-dangle': [0],
    // 逗号 间隔 风格
    'comma-spacing': [0],
    // 不输出 console
    'no-console': [0],
    'no-tabs': [0],
    'linebreak-style': [0],
    'space-infix-ops': [0],
    'keyword-spacing': [0],
    // 尾部无空格
    'no-trailing-spaces': [0],
    // "react/prop-types": [0],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : [0],
    'brace-style': [0],
    //
    'dot-notation': [0],
    // 解不解构赋值不是很重要吧
    'prefer-destructuring': [0],
    // 多行空格
    'no-multi-spaces': [0],

    'react/jsx-indent': [0],
    'react/require-default-props': [0],
    'react/jsx-indent-props': [0],
    // 不可以 属性={"nsnnsdsd"} 推荐 属性=""
    'react/jsx-curly-brace-presence': [0],
    'react/jsx-tag-spacing': [1],
    //constructor 要在static propTypes后面
    'react/sort-comp': [1],
    'react/no-unused-state': [1],
    // jsx 默认值的属性都为true
    'react/jsx-boolean-value': [0],
    'react/jsx-wrap-multilines': [0],
    'react/jsx-closing-tag-location': [0],
    'react/jsx-closing-bracket-location': [0],
    'react/self-closing-comp': [0],
    'react/no-find-dom-node': [0],
    // 第一个属性换行
    'react/jsx-first-prop-new-line': [1],
    // 一个属性一行
    'react/jsx-max-props-per-line': [1],
    'react/no-array-index-key': [1],
    'react/no-render-return-value': [0],

    'import/newline-after-import': [0],
    // 推荐 import {a} from "d";
    'import/no-named-as-default-member': [0],
    // 引用的组件要先import
    'import/first': [1],
    // jsx 属性引号风格
    'jsx-quotes': [0],
    'jsx-a11y/alt-text': [0],
    'jsx-a11y/img-redundant-alt': [0],
    'jsx-a11y/iframe-has-title': [0],

    'prefer-object-spread': [0],
    // 提示用箭头函数更爽
    'prefer-arrow-callback': [1],
    'prefer-const': [1],
    'no-useless-constructor': [1],
    'no-unused-vars': [1],
    'no-unreachable': [1],
    'quote-props': [1],
    'no-underscore-dangle': [0],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'eqeqeq': [1],
    // 不能 const b=9,b=2;
    'one-var': [0],
    'no-var': [0],
    'vars-on-top': [0],
    'one-var-declaration-per-line': [0],
    'guard-for-in': [1],
    'prefer-template': [1],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    // {data:data} 推荐改成 {data}
    'object-shorthand': [1],
    'no-shadow': [1],
    'no-lonely-if': [1],
    'no-script-url': [0],
    'no-unneeded-ternary': [0],
    'key-spacing': [1],
    'object-curly-spacing': [1],
    'spaced-comment': [0],
    'object-curly-spacing': [1],
    'lines-between-class-members': [0],
    // 链式方法换行
    'newline-per-chained-call': [0],
    // 不能对传进来的参数直接赋值
    'no-param-reassign': [1, { props: false }],
    'space-before-blocks': [1],
    'no-extra-semi': [0],
    'semi-spacing': [0],
    'block-spacing': [0],
    'radix': [1, 'as-needed'],
    'no-floating-decimal': [1],
    'arrow-spacing': [0],
    'no-case-declarations': [0],
    'camelcase': [0],
    'no-mixed-operators': [0],
    'no-new': [0],
    'no-loop-func': [0],
    'no-plusplus': [0],
    'no-void': [0],
    'no-eval': [
      'warn',
      {
        allowIndirect: true,
      },
    ],
    'no-self-compare': [0],
    // 每行的最大字符长度，这个不重要吧
    'max-len': [0],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/state-in-constructor': [0],
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': [0],
    'react/static-property-placement': [0],
    'react/jsx-fragments': [0],
    'react/jsx-curly-newline': [0],
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/', '^api'] }],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    'react/destructuring-assignment': [0],
    /*----end --- */
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  /* 增加全局变量, 避免 触发no-undef 规则 */
  globals: {
    less: true,
    define: true,
    range: true,
    arguments: true,
    CONFIG: true,
    $: true,
    jQuery: true,
    globalTheme: true,
    QRCode: true,
    __API_BASE_URL__: true,
    __IOFFICE_URL__: true,
    __LOGIN_PAGE__: true,
    __CUSTOM_ICON_NAMES__: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    // 不验证是否支持这些方法 see https://github.com/amilajack/eslint-plugin-compat/wiki/Adding-polyfills-(v2)
    'polyfills': ['fetch', 'Promise', 'Object', 'object-values'],
  },
};
