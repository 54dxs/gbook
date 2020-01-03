# GBook常见问题解答

此页面收集有关GBook格式和工具链的常见问题和答案。

关于gbook.54dxs.cn和编辑器的问题可以收集到[gbook.54dxs.cn/help的常见问题解答](https://gbook.54dxs.cn/help/faq.html)。

#### 我怎样才能主持/出版我的书？

图书可以很容易地在[gbook.54dxs.cn](https://gbook.54dxs.cn)上发布和托管。但是GBook输出可以托管在任何静态文件托管解决方案上。

#### 我可以用什么来编辑我的内容？

任何文本编辑器都应该工作！但我们建议使用[GBook编辑器](https://gbook.54dxs.cn/editor)。[gbook.54dxs.cn](https://gbook.54dxs.cn)也提供了这个编辑器的web版本。

---

#### GBook是否支持RTL/双向文本？

GBook格式支持从右向左和双向写入。要启用它，您需要指定一种语言（例如：`ar`），或者强制GBook在`book.json`中使用RTL：

``` json
{
    "language": "ar",
    "direction": "rtl"
}
```

在GBook的3.0版本中，它会根据内容自动检测。

_请注意，虽然输出手册确实会尊重RTL，但编辑器还不支持RTL编写。

#### 我应该在链接中使用`.html`或`.md`扩展名吗？

链接到文件时，应始终使用路径和`.md`扩展名，当目录中引用指向文件时，GBook将自动用相应的链接替换这些路径。

#### 我可以在存储库的子目录中创建GBook吗？

是的，可以在[子目录](structure.md#subdirectory)中创建GBooks。默认情况下，gbook.54dxs.cn和CLI也以一系列[文件夹](structure.md)的形式出现。

#### GBook支持RTL语言吗？

是的，GBook会自动检测页面的方向（`rtl`或`ltr`），并相应地调整布局。方向也可以在[book.json](config.md)中全局指定。

---

#### GBook支持数学公式吗？

GBook通过插件支持数学公式和TeX。目前有2个官方插件可以显示math:[mathjax](https://gbook.54dxs.cn/plugin/mathjax)和[katex](https://gbook.54dxs.cn/plugin/katex)。

#### 我可以定制输出吗？

是的，网站和电子书输出都可以使用[主题](themes/README.md)定制。

#### 我可以添加互动内容（视频等）吗？

GBook非常[可扩展](plugins/README.md)。您可以使用[现有插件](https://gbook.54dxs.cn/plugin)或创建您自己的插件！