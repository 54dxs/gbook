# 创建和发布插件

GBook插件是在NPM上发布的遵循定义的约定的节点包。

## 结构

#### package.json

`package.json` 是用于描述 **Node.js模块** 的清单格式。GBook插件构建在节点模块之上。它声明了在GBook中运行插件所需的依赖项、版本、所有权和其他信息。本文档详细描述了架构。

插件清单 `package.json` 还可以包含有关所需配置的详细信息。配置模式在 `package.json` 的 `gbook` 字段中定义（此字段遵循 [JSON-Schema](http://json-schema.org) 准则）：

```js
{
    "name": "gbook-plugin-mytest",
    "version": "0.0.1",
    "description": "这是我的第一个GBook插件",
    "engines": {
        "gbook": ">1.x.x"
    },
    "gbook": {
        "properties": {
            "myConfigKey": {
                "type": "string",
                "default": "这是默认值",
                "description": "它定义了我很棒的配置！"
            }
        }
    }
}
```

您可以从[NPM文档](https://docs.npmjs.com/files/package.json)了解更多关于 `package.json` 的信息。

这个 **package name** 必须以 `gbook-plugin-` 开头， 并且 **package engines** 应该包含 `gbook` 字段

#### index.js

The `index.js` 是插件运行时的主要入口点:

```js
module.exports = {
    // Map of hooks
    hooks: {},

    // Map of new blocks
    blocks: {},

    // Map of new filters
    filters: {}
};
```

## 发布你的插件

GBook插件可以在 [NPM](https://www.npmjs.com) 上发布。

To publish a new plugin, you need to create an account on [npmjs.com](https://www.npmjs.com) then publish it from the command line:
要发布新插件，您需要在 [npmjs.com](https://www.npmjs.com) 上创建一个帐户，然后从命令行发布它：

```
$ npm publish
```

## 私有插件

私有插件可以托管在GitHub上，并使用 `git` url导入：

```
{
    "plugins": [
        "myplugin@git+https://github.com/MyCompany/mygbookplugin.git#1.0.0"
    ]
}
```
