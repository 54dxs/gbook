# 目录结构

GitBook uses a simple directory structure. All Markdown/Asciidoc files listed in the [SUMMARY](pages.md) will be transformed as HTML. Multi-Lingual books have a slightly [different structure](languages.md).

A basic GitBook usually looks something like this:
GBook使用一个简单的目录结构。[摘要](pages.md)中列出的所有 Markdown/Asciidoc 文件都将转换为HTML。多语种书籍有一个稍微[不同结构](languages.md)。

基本的GBook通常如下所示：

```
.
├── book.json
├── README.md
├── SUMMARY.md
├── chapter-1/
|   ├── README.md
|   └── something.md
└── chapter-2/
    ├── README.md
    └── something.md
```

对每一项功能的概述：

| 文件 | 说明 |
| -------- | ----------- |
| `book.json` | 存储 [配置](config.md) 数据 (可选) |
| `README.md` | 你的书的前言/介绍 (**必须**) |
| `SUMMARY.md` | 目录 (详细请查看 [Pages](pages.md)) (可选) |
| `GLOSSARY.md` | 名词注释表 (详细请查看 [Glossary](lexicon.md)) (可选) |

### 静态文件和图像

静态文件是未在 `SUMMARY.md` 中列出的文件。除非[ignored](#ignore)，否则所有静态文件都将复制到输出。

### 忽略文件和文件夹{#忽略}

GBook将读取`.gitignore`、`.bookignore`和`.ignore`文件，以获取要跳过的文件和文件夹列表。
这些文件中的格式遵循与`.gitignore`相同的约定：

```
# 这是一个评论

# 忽略文件test.md
test.md

# 忽略"bin"目录中的所有内容
bin/*
```

### 与子目录{#子目录}的项目集成

对于软件项目，可以使用子目录(如 `docs/`)存储项目文档的书籍。您可以配置[`root`选项](config.md)以指示GBook可以在其中找到该书的文件的文件夹：

```
.
├── book.json
└── docs/
    ├── README.md
    └── SUMMARY.md
```

其中 `book.json` 包含:

```
{
    "root": "./docs"
}
```
