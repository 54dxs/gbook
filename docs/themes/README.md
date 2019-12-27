# 主题

从3.0.0版本开始，GBook可以很容易地设置主题。默认情况下，书籍使用[主题默认值](https://github.com/54dxs/gbook-plugin-theme-default)主题。

> **注意**：自定义主题可能会阻止某些插件正常工作。

### 主题的结构

主题是包含模板和资源的插件。重写任何单个模板都是可选的，因为主题总是扩展默认主题。

| 文件夹 | 说明 |
| -------- | ----------- |
| `_layouts` | 包含所有模板的主文件夹 |
| `_layouts/website/page.html` | 普通页面模板 |
| `_layouts/ebook/page.html` | 生成电子书期间正常页面的模板 (PDF< ePub, Mobi) |


### 在书中扩展/自定义主题

作者可以直接从书的源代码扩展主题的模板（无需创建外部主题）。模板将首先在书的`_layouts`文件夹中解析，然后在已安装的插件/主题中解析。

### Extend instead of Forking

如果要使主题更改对多本书可用，而不是派生默认主题，则可以使用[模板语法](../templating/README.md)对其进行扩展：

```html
{% extends template.self %}

{% block body %}
    {{ super() }}
    ... This will be added to the "body" block
{% endblock %}
```

查看[API](https://github.com/GitbookIO/theme-api)主题以获得更完整的示例。

### 发布主题

主题以带有 `theme-` 前缀的插件([参见相关文档](../plugins/README.md))形式发布。例如，主题`awesome`将从`theme-awesome`插件加载，然后从`gbook-plugin-theme-awesome`NPM包加载。
