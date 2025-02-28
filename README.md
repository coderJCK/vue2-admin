## node版本

v20.15.1

## 规范

Eslint + Prettier + Husky + Commitlint+ Lint-staged
**f2elint** 「阿里巴巴前端规约」项目，项目主要包括「规约文档」和「配套工具」两部分，目前只开放了「配套工具」部分，可以使用 F2ELint 等配套工具实现项目规范。
全局安装

```
npm install -g f2elint
```

### 代码规范

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

### git规范

1. husky 操作git勾子的工具
2. lint-staged 本地暂存代码检查工具
3. commitlint 信息检验工具
4. commitizen 辅助commit信息工具
   全局安装

```
npm install -g commitizen
```

提交时选择类型

```
git cz
```
