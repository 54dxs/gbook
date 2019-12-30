# Pages 和 Summary

### Summary

GBook使用一个`SUMMARY.md`文件来定义书籍章节和子章节的结构。`SUMMARY.md`文件用于生成书籍的目录。

`SUMMARY.md`的格式只是一个链接列表。链接的标题用作章节的标题，链接的目标是指向该章节文件的路径。

将嵌套列表添加到父章将创建子章。

##### 简单的例子

```markdown
# Summary

* [第一部分](part1/README.md)
    * [写作很好](part1/writing.md)
    * [GBook很不错](part1/gitbook.md)
* [第二部分](part2/README.md)
    * [我们喜欢反馈](part2/feedback_please.md)
    * [更好的作者工具](part2/better_tools.md)
```

每一章都有一个专门的页面(`part#/README.md`)，分为多个子章。


##### 锚

目录中的章节可以使用锚定指向文件的特定部分。

```markdown
# Summary

### 第一部分

* [第一部分](part1/README.md)
    * [写作很好](part1/README.md#writing)
    * [GBook很不错](part1/README.md#gitbook)
* [第二部分](part2/README.md)
    * [我们喜欢反馈](part2/README.md#feedback)
    * [更好的作者工具](part2/README.md#tools)
```


##### Parts

目录可以分成几个部分，用标题或横线隔开：

```markdown
# Summary

### 第一部分

* [写作很好](part1/writing.md)
* [GBook很不错](part1/gitbook.md)

### 第二部分

* [我们喜欢反馈](part2/feedback_please.md)
* [更好的作者工具](part2/better_tools.md)

----

* [无标题的最后一部分](part3/title.md)
```

Parts只是一组章节，没有专门的页面，但是根据主题，它会在导航中显示出来。

### Pages

#### Markdown 语法

默认情况下，GBook的大多数文件都使用Markdown语法。GBook从中推断出页面的结构。使用的语法类似于[GitHub风格的Markdown语法](https://guides.github.com/features/mastering-markdown/)。也可以选择[AsciiDoc语法](asciidoc.md)。

##### 章节文件示例

``` markdown
# 本章标题

这是一个很好的介绍。

## 第一节

Markdown will dictates _most_ of your **book's structure**

## 第二节

...

```

#### Front Matter

页面可以包含可选的前端内容。它可以用来定义页面的描述。前面的内容必须是文件中的第一件事，并且必须采用三条虚线之间的有效YAML集的形式。下面是一个基本示例：

```yaml
---
描述：这是我页面的简短描述
---

# 我页面的内容
...
```

前面的内容可以定义自己的变量，它们将被添加到[页面变量](templating/variables.md)中，以便在模板中使用它们。