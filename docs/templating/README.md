# 模板化

GBook使用[Nunjucks模板语言](https://mozilla.github.io/nunjucks/)来处理页面和主题的模板。

Nunjucks语法与**Jinja2**或**Liquid**非常相似。它的语法使用括号`{ }`来标记需要处理的内容。

### 变量

变量从模板上下文中查找值。如果只想显示一个变量，可以使用`{{ variable }}`语法。例如：

```twig
我叫{{ name }}，很高兴认识你
```

这将从上下文中查找用户名并显示它。变量名中可以有点来查找属性，就像JavaScript一样。也可以使用方括号语法。

```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

如果值未定义，则不显示任何内容。如果foo未定义，则以下所有输出都为空：`{{ foo }}`, `{{ foo.bar }}`, `{{ foo.bar.baz }}`。

GBook从上下文中提供了一组[预定义变量](variables.md)。

### 过滤器

过滤器本质上是可以应用于变量的函数。它们是用管道运算符(`|`)调用的，可以接受参数。

```twig
{{ foo | title }}
{{ foo | join(",") }}
{{ foo | replace("foo", "bar") | capitalize }}
```

第三个例子展示了如何链接过滤器。它将显示"Bar"，首先将"foo"替换为"bar"，然后将其大写。

### Tags

##### if

`if`测试条件并允许您有选择地显示内容。它的行为与JavaScript的`if`行为完全相同。

```twig
{% if variable %}
  It is true
{% endif %}
```

如果变量被定义并计算为true，则将显示"It is true"。否则，什么都不会。

可以使用`elif`和`else`指定替代条件：

```twig
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

##### for

`for` 遍历数组和字典.

```twig
# 关于GBook的章节

{% for article in glossary.terms['gbook'].articles %}
* [{{ article.title }}]({{ article.path }})
{% endfor %}
```

##### set

`set` 允许您创建/修改变量.

```twig
{% set softwareVersion = "1.0.0" %}

当前版本是 {{ softwareVersion }}.
[Download it](website.com/download/{{ softwareVersion }})
```

##### include and block

包含和继承在[内容引用](conrefs.md)部分有详细说明

### Escaping

如果希望GBook忽略任何特殊的模板标记，可以使用raw，其中的任何内容都将以纯文本输出。

``` twig
{% raw %}
  this will {{ not be processed }}
{% endraw %}
```
