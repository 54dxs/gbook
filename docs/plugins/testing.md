# 测试你的插件

### 在本地测试插件

在发布之前，可以使用[npm link](https://docs.npmjs.com/cli/link)在书上测试插件。

在插件的文件夹中，运行：

```
$ npm link
```

然后在你book的文件夹中：

```
$ npm link gbook-plugin-<plugin's name>
```

### Travis的单元测试

[gbook-tester](https://github.com/todvora/gbook-tester)使为插件编写**Node.js/Mocha**单元测试变得非常容易。使用[Travis.org](https://travis.org)，可以在每个commits/tags上运行测试。