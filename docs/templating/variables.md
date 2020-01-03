# 变量

以下是在图书解析和主题生成过程中可用数据的参考。

### 全局变量

|   变量   |     描述     |
| -------- | ----------- |
| `book` | Book-wide information + 来自 `book.json` 的配置设置。详情见下文。 |
| `gbook` | GBook特定信息 |
| `page` | 当前 page 的特定信息 |
| `file` | 与当前页特定信息关联的文件 |
| `readme` | Readme文件信息 |
| `glossary` | Glossary文件信息 |
| `summary` | 目录信息 |
| `languages` | 多语种图书语言一览表 |
| `output` | 关于输出生成器的信息 |
| `config` | 转储 `book.json` |

### Book 变量

| Variable | Description |
| -------- | ----------- |
| `book.[CONFIGURATION_DATA]` | 通过 `book.json` 设置的所有`variables`都可以通过book变量获得 |
| `book.language` | 多语种图书的当前语言 |

### GBook 变量

| Variable | Description |
| -------- | ----------- |
| `gbook.time` | 当前时间（运行`gbook`命令时） |
| `gbook.version` | 用于生成图书的gbook版本 |

### File 变量

| Variable | Description |
| -------- | ----------- |
| `file.path` | 原始页的路径 |
| `file.mtime` | 修改时间。上次修改文件的时间 |
| `file.type` | 用于编译此文件的解析器的名称（例如：`markdown`, `asciidoc`，等等）|

#### Page 变量

| Variable | Description |
| -------- | ----------- |
| `page.title` | page的标题 |
| `page.previous` | 目录中的前一页（可以是`null`） |
| `page.next` | 目录中的下一页（可以为`null`） |
| `page.dir` | 文本方向，基于配置或从内容中检测（`rtl`或`ltr`） |

#### 目录变量

| Variable | Description |
| -------- | ----------- |
| `summary.parts` | 目录中的节列表 |

可以访问整个目录（`SUMMARY.md`）：

`summary.parts[0].articles[0].title`将返回第一篇文章的标题。

#### 多语种图书变量

| Variable | Description |
| -------- | ----------- |
| `languages.list` | 这本书的语言列表 |

语言由 `{ id: 'en', title: 'English' }` 定义

### Output 变量

| Variable | Description |
| -------- | ----------- |
| `output.name` | 输出生成器的名称，可能的值为`website`, `json`, `ebook` |
| `output.format` | 当`output.name == "ebook"`时，`format`定义将生成的电子书格式，可能的值为`pdf`, `epub` 或 `mobi` |

### Readme 变量

| Variable | Description |
| -------- | ----------- |
| `readme.path` | 指向书中自述文件的路径 |

### Glossary 变量

| Variable | Description |
| -------- | ----------- |
| `glossary.path` | 指向书中Glossary的路径 |
