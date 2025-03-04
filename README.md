## node版本

v20.15.1

## 规范

Eslint + Prettier + Husky + Commitlint+ Lint-staged
**f2elint** 「阿里巴巴前端规约」项目，项目主要包括「规约文档」和「配套工具」两部分，目前只开放了「配套工具」部分，可以使用 F2ELint 等配套工具实现项目规范。
全局安装

```
npm install -g f2elint
```

### 开发规范

1. 代码检查工具

- eslint

```
yarn add eslint -D
npx eslint --init
```

2. 代码风格工具

- prettier

```
npm i prettier eslint-config-prettier eslint-plugin-prettier -D
```

创建.prettierrc

### git提交规范

1. husky 操作git勾子的工具
2. lint-staged 本地暂存代码检查工具
3. commitlint 信息检验工具
4. commitizen 辅助commit信息工具
   全局安装

安装commitizen

```
npm install -g commitizen
```

提交

```
git cz
```

## axios二次封装

> 针对 axios 的二次封装，合理的策略应兼顾灵活性、可维护性和功能性。以下是一个综合性强、可扩展性高的封装方案，适用于中大型项目：

1. 封装实例与基本配置 — base.js
2. 拦截器封装 - base.js
3. 错误码处理封装 - error.js
4. 封装方式封装 - methods.js
5. 模块化API封装 - requests.js
6. 高级功能集成
   - 请求取消 - cancel.js
   - 大文件上传 - slice.js
   - 请求重试 - retry.js

##

##
