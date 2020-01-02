# 内容引用

内容引用（conref）是一种方便的机制，可以重用其他文件或书籍中的内容。

### 导入本地文件

使用 `include` 标记可以轻松导入其他文件的内容：

```
{% include "./test.md" %}
```

### 从另一本书导入文件

GBook还可以使用git解析include路径：

```
{% include "git+https://github.com/54dxs/documentation.git/README.md#0.0.1" %}
```

git url的格式为：

```
git+https://user@hostname/owner/project.git/file#commit-ish
```

真正的git url部分应该以 `.git` 结束，要导入的文件名将在`.git`之后提取，直到url的片段。

`commit-ish`可以是任何标记、sha或分支，可以作为`git checkout`的参数提供。默认值为`master`。

### 继承

模板继承是一种使模板易于重用的方法。编写模板时，可以定义子模板可以覆盖的"blocks"。继承链可以是您喜欢的长度。

`block`定义模板上的节并用名称标识它。基本模板可以指定块，子模板可以使用新内容覆盖它们。

```
{% extends "./mypage.md" %}

{% block pageContent %}
# 这是我的网页内容
{% endblock %}
```

在`mypage.md`文件中，您应该指定可以扩展的块：

```
{% block pageContent %}
这是默认内容
{% endblock %}

# License

{% include "./LICENSE" %}
```
