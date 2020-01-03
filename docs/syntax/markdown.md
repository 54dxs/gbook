# Markdown

本文档中的大多数示例都在Markdown中。Markdown是GBook的默认解析器，但也可以选择[AsciiDoc syntax](asciidoc.md)。

这里概述了可以与GBook一起使用的标记语法（与GitHub中添加的语法相同）。

### 标题

要创建标题，请在标题文本前添加1到6个 `#` 符号。使用的#数量将决定标题的大小。

```markdown
# 这是一个<h1>标记
## 这是一个<h2>标记
###### 这是一个<h6>标记
```

GBook支持一种很好的方式来显式地设置头ID。如果在头文本后面有一个开头的花括号（与至少有一个空格的文本分开）、哈希、ID和结尾的花括号，则在头上设置ID。如果使用atx样式头的尾部散列功能，则头ID必须在尾部散列之后。例如：

```markdown
Hello {#id}
-----

# Hello {#id}

# Hello # {#id}
```

### 段落和换行符{#段落}

A paragraph is simply one or more consecutive lines of text, separated by one or more blank lines. (A blank line is any line that looks like a blank line — a line containing nothing but spaces or tabs is considered blank.) Normal paragraphs should not be indented with spaces or tabs.

段落只是一行或多行连续的文本，由一行或多行空行分隔。（空行是任何看起来像空行的行-除了空格或制表符以外什么都不包含的行被认为是空行。）普通段落不应缩进空格或制表符。

```
这是我们的开场白。

这一行与上面的一行用两个换行符隔开，所以它将是一个*单独的段落*。
```

### 强调{#强调}

```markdown
*此文本将为斜体*
_这也将是斜体_

**此文本将为粗体**
_这也将是粗体_

~~此文本将被删除~~

_你 **可以** 组合它们_
```

### 列表{#列表}

Markdown支持有序（编号）和无序（项目符号）列表。

##### 无序的

无序列表使用星号、加号和连字符（可替换）作为列表标记：

```markdown
* Item 1
* Item 2
  * Item 2a
  * Item 2b
```

##### 有序的

有序列表使用数字后跟句点：

```markdown
1. Item 1
2. Item 2
3. Item 3
   * Item 3a
   * Item 3b
```

### 链接{#链接}

Markdown支持两种链接样式：内联和引用。

可以通过将文本用方括号括起来和链接URL用括号括起来来创建简单的链接：

```markdown
这是带有标题的 [示例](http://example.com/ "Title") 内联链接

[此链接](http://example.net/) 没有title属性
```

链接可以指向相对路径、锚或绝对url。


### 参考文献

还有一种方法可以创建不中断文本流的链接。URL和标题是使用引用名称定义的，然后此引用名称在方括号中而不是链接URL中使用：

```markdown
这是[示例][id]reference-style链接
```

然后，在文档中的任何位置，您都可以在一行上自行定义这样的链接标签：

```markdown
[id]: http://example.com/  "此处为可选标题"
```

### 图像{#图像}

图像的创建方式与链接类似：只需在方括号前使用感叹号。链接文本将成为图像的可选文本，链接URL指定图像源：

```markdown
An image: ![gras](img/image.jpg)
```

### 双引号{#双引号}

一个blockquote是使用 `>` 标记和一个可选空格开始的；下面所有以blockquote标记开始的行都属于blockquote。可以在blockquote中使用任何块级元素：

```markdown
正如坎耶·韦斯特所说：

> 我们生活在未来，所以
> 现在是我们的过去。
```

### 表格{#表格}

You can create tables by assembling a list of words and dividing them with hyphens `-` (for the first row), and then separating each column with a pipe `|`:

可以通过组合单词列表并用连字符 `-`（第一行）分隔它们，然后用管道 `|` 分隔每一列来创建表：

```markdown
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
```

table两端的管道是可选的。单元格的宽度可以变化，不需要在列中完全对齐。标题行的每列中必须至少有三个连字符。

### 代码{#代码}

标记支持两种不同的代码块样式。一个使用四个空格或一个制表符缩进的行，而另一个使用带颚化符的行作为分隔符，因此不需要缩进内容：

```markdown
这是一个示例代码块。

    在这里继续。

```

##### 围栏代码块

通过在代码块前后放置三个反勾号 ` ``` ` ，可以创建受保护的代码块。我们建议在代码块前后放置一个空行，以使原始格式更易于阅读。

    ```
    function test() {
      console.log("注意这个函数之前的空白行？");
    }
    ```

##### 语法突出显示

您可以添加可选的语言标识符，以便在隔离代码块中启用语法突出显示。

例如，要语法突出显示Ruby代码：

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

##### 内联代码

文本短语可以标记为代码，方法是用反勾号包围它们：

    使用 `gbook` 转换标记中的 `text` 
    HTML的语法。

### 脚注

GBook支持此类脚注的简单语法。脚注是相对于每一页的。

```markdown
脚注引用之前的文本.[^2]

[^2]: 要包含在脚注中的注释.
```

### HTML

GBook支持在文本中使用原始HTML，不处理HTML中的Markdown语法：

```
<div>
此处的Markdown将不被**解析**
</div>
```

### 水平尺

水平规则可以使用三个或三个以上的星号、破折号或下划线（可选地用空格或制表符分隔）插入到空白行中：

```markdown
三个或更多...

---

连字符

***

星号

```

### 忽略标记格式

您可以告诉GBook忽略（或转义）标记格式，方法是在标记字符前使用 `\`。

```
让我们重命名 \*our-new-project\* 为 \*our-old-project\*.
```
