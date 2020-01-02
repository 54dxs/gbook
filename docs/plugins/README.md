# 插件

插件是扩展GBook功能（电子书和网站）的最佳方式。存在插件做很多事情：带来数学公式显示支持，跟踪访问使用谷歌分析等。


### 如何找到插件？

插件可以在[https://www.npmjs.com](https://www.npmjs.com/)上轻松搜索。


### 如何安装插件？

找到要安装的插件后，需要将其添加到 "book.json" 中：

```
{
    "plugins": ["myPlugin", "anotherPlugin"]
}
```

也可以使用 `"myPlugin@0.3.1"` 指定特定版本。默认情况下，GBook将解析插件兼容的最新版本与当前GBook版本。


### gbook.54dxs.cn网站

在本地，运行 `gbook install` 来安装和准备书籍的所有插件。命令执行后将自动从[https://www.npmjs.com](https://www.npmjs.com/)下载到本地。


### 配置插件

特定于插件的配置存储在 `pluginsConfig` 中。有关可用选项的详细信息，请参阅插件本身的文档。