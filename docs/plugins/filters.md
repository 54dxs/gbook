# Extend Filters

Filters are essentially functions that can be applied to variables. They are called with a pipe operator (`|`) and can take arguments.

```
{{ foo | title }}
{{ foo | join(",") }}
{{ foo | replace("foo", "bar") | capitalize }}
```

### Defining a new filter

Plugins can extend filters by defining custom functions in their entry point under the `filters` scope.

A filter function takes as first argument the content to filter, and should return the new content.
Refer to [Context and APIs](./api.md) to learn more about `this` and GitBook API.

```js
module.exports = {
    filters: {
        hello: function(name) {
            return 'Hello '+name;
        }
    }
};
```

The filter `hello` can then be used in the book:

```
{{ "Aaron"|hello }}, how are you?
```

### Handling block arguments

Arguments can be passed to filters:

```
Hello {{ "Samy"|fullName("Pesse", man=true}} }}
```

Arguments are passed to the function, named-arguments are passed as a last argument (object).

```js
module.exports = {
    filters: {
        fullName: function(firstName, lastName, kwargs) {
            var name = firstName + ' ' + lastName;

            if (kwargs.man) name = "Mr" + name;
            else name = "Mrs" + name;

            return name;
        }
    }
};
```

# 扩展筛选器

过滤器本质上是可以应用于变量的函数。它们是用管道运算符 (`|`) 调用的，可以接受参数。


```
{{ foo | title }}
{{ foo | join(",") }}
{{ foo | replace("foo", "bar") | capitalize }}
```


### 定义新筛选器

插件可以通过在 `filters` 作用域下的入口点中定义自定义函数来扩展过滤器。

filter函数将要筛选的内容作为第一个参数，并应返回新内容。

请参阅 [Context and APIs](./api.md) 以了解有关 `this` 和GBook api的更多信息。

```js
module.exports = {
    filters: {
        hello: function(name) {
            return 'Hello '+ name;
        }
    }
};
```

过滤器 `hello` 可以在书中使用：

```
{{ "Aaron"|hello }}, how are you?
```


### 处理块参数

参数可以传递给筛选器：

```
Hello {{ "Samy"|fullName("Pesse", man=true}} }}
```

参数传递给函数，命名参数作为最后一个参数（对象）传递。

```js
module.exports = {
    filters: {
        fullName: function(firstName, lastName, kwargs) {
            var name = firstName + ' ' + lastName;

            if (kwargs.man) name = "Mr" + name;
            else name = "Mrs" + name;

            return name;
        }
    }
};
```