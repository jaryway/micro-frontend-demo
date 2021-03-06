# micro-frontend-demo

### 解决方案

1. 方案 1： boot 站点和 core 站点分离 ，core 站点和模块站点使用 amd 打包，此种方案需要解决第三方库 amd 合并打包及 amd 模块加载的问题

   - systemjs 需要包含 amd 模块
   - 此时若想把第三方库合并成一个文件，则需要给 amd 模块加上 id `define(id,[],function)`
   - 通常情况下，第三方库都有 umd 版本，但这些版本中，amd 的 define 一般都没加上 id，此时合并时需要加上 id
   - 此时的模块站点需要使用 amd （即 `libararyTarget:'amd'`）打包
   - 站点结构：boot + core + submodule1 + submodule2

2. 方案 2：core 站点集成 boot，模块站点使用全局变量 （即 `libararyTarget:'window'`） 打包，第三方库直接引入，通过全局变量使用即可
   - 因为此时是通过全局变量引入第三方库，所以 systemjs 不需要 amd 模块
   - 此时第三方库可以直接合并
   - 站点结构：base(boot+core) + submodule1 + submodule2

`注意：`

- 把第三方库提取出来后 webpack 配置中要配置 externals 属性，把第三方库排除掉
- externals 配置: amd 对应的是 `externals:{react:'react'}`, window 对应的是 `externals:{react:'React'}`
- 目前选择**方案 1**

### 开发、构建、部署

#### base-app 构建

- 1、`webpack` 配置：

  - 使用 `amd` 模式打包 `libraryTarget: 'amd'`
  - 添加 `html-webpack-project-config-plugin` 插件，并配置 `options.store` 属性
  - 添加 `.env` 文件，并添加 `PUBLIC_URL` 配置，确保能正确加载资源文件
  - 添加 `externals` 将公共类库排除
  - 添加 `store` 入口，
  - 项目以 `amd` 方式加载，所有 `Output` 添加 `libraryTarget: 'amd'`
  - 禁用 `runtimeChunk` 配置
  - 配置 `HtmlWebpackPlugin` 的 `chunks: ['main']`


* 2、项目改造：
  - 添加 `single-spa-react` ,并根据 `single-spa` 改造项目入口文件
* 项目部署
  - 将项目放入 `boot-app` 根目录中
  - 将项目生成的 `project.json` 文件中的内容拷贝到 `project-config.json` `projects` 中

### 待解决的问题

1. 如何自动化部署？
2. 如何实现子模块独立运行？
3. 开发环境下如何独立运行？
4. 生产环境下如何独立部署？
5. 要不要登录页面？
6. 用户如何鉴权？
7. 公共组件如何共享，夸模块引用？

### 如何部署

- 子项目：依次构建子项目并 copy 项目到 `boot-app/public` 下
- `boot-app`： merge project.json 到 project.config.json,构建项目；
