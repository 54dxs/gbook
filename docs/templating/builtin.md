# 内置模板助手

GBook提供了一系列内置过滤器和块来帮助您编写模板。

### Filters

`value|default(default, [boolean])`如果值严格未定义，则返回默认值，否则返回值。如果boolean为true，任何JavaScript falsy值都将返回默认值(false, "", etc)

`arr|sort(reverse, caseSens, attr)`使用JavaScript的arr.Sort函数对arr进行排序。如果reverse为true，则结果将被反转。Sort默认不区分大小写，但将caseSens设置为true会使其区分大小写。如果传递attr，将比较每个项目的attr。

### Blocks

`{% markdown %}Markdown string{% endmarkdown %}`
渲染内联Markdown

`{% asciidoc %}AsciiDoc string{% endasciidoc %}`
呈现内联AsciiDoc
