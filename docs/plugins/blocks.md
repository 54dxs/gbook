# 扩展块

扩展模板块是向作者提供额外功能的最佳方式。

最常见的用法是在运行时在某些标记中处理内容。它类似于 [filters](./filters.md) ，但使用steroids是因为你不局限于一个表达式。

### 定义新块

块由插件定义，块是与块描述符关联的名称映射。块描述符至少需要包含一个 `process` 方法。

```js
module.exports = {
    blocks: {
        tag1: {
            process: function(block) {
                return "Hello "+block.body+", How are you?";
            }
        }
    }
};
```

`process` 应该返回将替换标记的html内容。请参阅 [Context and APIs](./api.md) 以了解有关 `this` 和GBook api的更多信息。

### 处理块参数

参数可以传递给块:

```
{% tag1 "argument 1", "argument 2", name="Test" %}
This is the body of the block.
{% endtag1 %}
```

在 `process` 方法中可以很容易地访问参数：

```js
module.exports = {
    blocks: {
        tag1: {
            process: function(block) {
                // block.args equals ["argument 1", "argument 2"]
                // block.kwargs equals { "name": "Test" }
            }
        }
    }
};
```

### 处理子块

定义的块可以解析为不同的子块，例如，让我们考虑源代码：

```
{% myTag %}
    Main body
    {% subblock1 %}
    Body of sub-block 1
    {% subblock 2 %}
    Body of sub-block 1
{% endmyTag %}
```
