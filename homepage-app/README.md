微前端子项目实例 app(react)

### 初始化项目

```shell
npx create-react-app my-subapp --typescript
# or
yarn create react-app my-subapp --typescript
```

### eject 项目，添加 `webpack` 相关配置

- Copy 一份 webpack.config.js 文件，重命名为 webpack.config.micro.js
- 使用 `amd` 模式打包 `libraryTarget: 'amd'`
- 添加 `html-webpack-project-config-plugin` 插件，并配置 `options.store` 属性
- 添加 `.env` 文件，并添加 `PUBLIC_URL` 配置，确保能正确加载资源文件
- 添加 `externals` 将公共类库排除
- 添加 `store` 入口，store
- 项目以 `amd` 方式加载，所有 `Output` 添加 `libraryTarget: 'amd'`
- 禁用 `runtimeChunk` 配置
- 配置 `HtmlWebpackPlugin` 的 `chunks: ['main']`

### 项目改造

- 添加 `single-spa-react` ,并根据 `single-spa` 改造项目入口文件


### 可用脚本

```sh
# dev 模式启动项目

yarn start

# 构建微前端 app

yarn build:micro

```

### 如何使用

Clone 项目后，修改项目名称，运行 yarn install && yarn start