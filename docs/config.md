# 配置

GBook允许你使用灵活的配置定制你的书。这些选项在`book.json`文件中指定。对于不熟悉JSON语法的作者，可以使用[JSONlint](http://jsonlint.com)等工具验证语法。

### 常规设置

| 变量 | 描述 |
| -------- | ----------- |
| `root` | 指向根文件夹的路径，该文件夹包含除`book.json`之外的所有书本文件|
| `structure` | 指定自述文件、摘要、词汇表等的路径，请参见[结构段落](#structure) |
| `title` | 书名，默认值从自述文件中提取。在gbook.54dxs.cn上，此字段是预先填充的 |
| `description` | 对书本的描述，默认值从自述文件中提取。在gbook.54dxs.cn上，此字段是预先填充的 |
| `author` | 作者的姓名。在gbook.54dxs.cn上，此字段是预先填充的 |
| `isbn` | 这本书的ISBN |
| `language` | [ISO code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 本书的语言, 默认是 `en` |
| `direction` | 文本的方向。可以是`rtl`或`ltr`，默认值取决于`language`的值 |
| `gbook` | 应该使用的gbook的版本。使用[SemVer](http://semver.org)规范并接受诸如`">= 3.0.0"`这样的条件 |

### 插件

插件及其配置在`book.json`中指定。请参阅[插件部分](plugins/README.md)了解更多详细信息。

自3.0.0版以来，GBook可以使用主题。有关详细信息，请参见[主题部分](themes/README.md)。

| 变量 | 描述 |
| -------- | ----------- |
| `plugins` | 要加载的插件列表 |
| `pluginsConfig` | 插件对应的配置信息 |

### Structure

除了`root`变量之外，您还可以告诉Gbook的 Readme、Summary、Glossary和Languages的文件名（而不是使用默认名称，如`README.md`）。

这些文件必须在你的书的根（或每一本语言书的根）。不接受`dir/MY_README.md`等路径。

| 变量 | 描述 |
| -------- | ----------- |
| `structure.readme` | 自述文件名 (默认为 `README.md`) |
| `structure.summary` | 摘要文件名 (默认为 `SUMMARY.md`) |
| `structure.glossary` | 词汇表文件名 (默认为 `GLOSSARY.md`) |
| `structure.languages` | 语言文件名 (默认为 `LANGS.md`) |

### PDF选项

PDF输出可以使用`book.json`中的一组选项进行自定义：

| 变量 | 描述 |
| -------- | ----------- |
| `pdf.pageNumbers` | 在每页的底部添加页码(默认值为 `true`) |
| `pdf.fontSize` | 基本字体大小 (默认值为 `12`) |
| `pdf.fontFamily` | 基本字体系列 (默认值为 `Arial`) |
| `pdf.paperSize` | 纸张大小，选项为 `'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'legal', 'letter'` (默认值为 `a4`) |
| `pdf.margin.top` | 上边距 (默认值为 `56`) |
| `pdf.margin.bottom` | 下边距 (默认值为 `56`) |
| `pdf.margin.right` | 右边距 (默认值为 `62`) |
| `pdf.margin.left` | 左边距 (默认值为 `62`) |
