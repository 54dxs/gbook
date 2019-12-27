# AsciiDoc

由于版本是 `2.0.0`，GBook也可以接受AsciiDoc作为输入格式。

有关格式的详细信息，请参阅[AsciiDoc语法快速参考](http://asciidoctor.org/docs/asciidoc-syntax-quick-reference/)。

和markdown一样，GBook使用一些特殊文件来提取结构：`README.adoc`, `SUMMARY.adoc`, `LANGS.adoc` 和 `GLOSSARY.adoc`。

### README.adoc

这是你book的主要条目：导言。此文件是**必需**。

### SUMMARY.adoc

此文件定义章节和子章节的列表。就像在Markdown中一样，`SUMMARY.adoc` 格式只是一个链接列表，链接的名称用作章节的名称，目标是指向该章节文件的路径。

子章的定义只需将嵌套列表添加到父章。

```asciidoc
= Summary

. link:chapter-1/README.adoc[Chapter 1]
.. link:chapter-1/ARTICLE1.adoc[Article 1]
.. link:chapter-1/ARTICLE2.adoc[Article 2]
... link:chapter-1/ARTICLE-1-2-1.adoc[Article 1.2.1]
. link:chapter-2/README.adoc[Chapter 2]
. link:chapter-3/README.adoc[Chapter 3]
. link:chapter-4/README.adoc[Chapter 4]
.. Unfinished article
. Unfinished Chapter
```

### LANGS.adoc

对于 [多语言](./languages.md) 书籍，此文件用于定义支持的不同语言和翻译。

此文件遵循与 `SUMMARY.adoc` 相同的语法：

```asciidoc
= Languages

. link:en/[英语]
. link:fr/[法语]
```

### GLOSSARY.adoc

此文件用于定义术语。[参见词汇表部分](./lexicon.md)

```asciidoc
= Glossary

== Magic

足够先进的技术，超出了
产生惊奇感的观察者。

== PHP

A popular web programming language, used by many large websites such
as Facebook. Rasmus Lerdorf originally created PHP in 1994 to power
his personal homepage (PHP originally stood for "Personal Home Page"
but now stands for "PHP: Hypertext Preprocessor"). ```

一种流行的网络编程语言，被许多大型网站如Facebook所使用。
Rasmus Lerdorf最初于1994年创建了PHP，以供使用于
他的个人主页（PHP最初代表“个人主页”但现在代表“PHP：超文本预处理器”）。```

