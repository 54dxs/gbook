# GBook的安装

安装GBook并准备就绪只需要几分钟。

### gbook.54dxs.cn

[gbook.54dxs.cn](https://gbook.54dxs.cn) 是一个易于使用的解决方案，可以编写、发布和托管书籍。它是发布内容和进行协作的最简单的解决方案。

它与[GBook编辑器](https://gbook.54dxs.cn/editor)集成的非常好

### 本地安装

##### 要求

安装GBook非常简单。您的系统只需要满足以下两个要求：

* NodeJS (推荐v4.0.0及以上版本)
* Windows, Linux, Unix, or Mac OS X

##### 用NPM安装

安装GBook的最佳方法是通过**NPM**。在终端提示下，只需运行以下命令安装GBook：

```
$ npm install gbook-cli -g
```

`gbook-cli` 是一个实用程序，可以在同一系统上安装和使用多个版本的GBook。它将自动安装所需版本的GBook来构建一本书。

##### 创建一本书

GBook可以设置样板书：

```
$ gbook init
```

如果希望将图书创建到新目录中，可以通过运行`gbook init ./directory`来执行此操作

使用以下工具预览和服务您的书：

```
$ gbook serve
```

或者使用以下方法建立静态网站：

```
$ gbook build
```

##### 安装预发行版

`gitbook-cli` 可以轻松下载和安装GBook的其他版本，以便使用您的图书进行测试：

```
$ gbook fetch beta
```

使用 `gbook ls-remote` 列出可用于安装的远程版本。

##### 调试

您可以使用选项`--log=debug`和`--debug`获得更好的错误消息（使用堆栈跟踪）。例如：

```
$ gbook build ./ --log=debug --debug
```

