# Context and APIs

GBooks为插件提供了不同的API和上下文。这些api可以根据使用的GBook版本而有所不同，插件应该相应地在 `package.json` 中指定 `engines.gbook` 字段。

#### Book实例

`Book` 类是GBook的中心点，它集中了所有访问读取方法。这个类在[book.js](https://github.com/54dxs/gbook/blob/master/lib/book.js)中定义。

```js
// 从book.json读取配置
var value = book.config.get('title', 'Default Value');

// 将文件名解析为绝对路径
var filepath = book.resolve('README.md');

// 呈现内联标记字符串
book.renderInline('markdown', 'This is **Markdown**')
    .then(function(str) { ... })

// 呈现标记字符串（块模式）
book.renderBlock('markdown', '* This is **Markdown**')
    .then(function(str) { ... })
```

#### Output实例

`Output` 类表示输出/写入进程。

```js
// 返回输出的根文件夹
var root = output.root();

// 解析输出文件夹中的文件
var filepath = output.resolve('myimage.png');

// 将文件名转换为URL（返回html文件的路径）
var fileurl = output.toURL('mychapter/README.md');

// 在输出文件夹中写入文件
output.writeFile('hello.txt', 'Hello World')
    .then(function() { ... });

// 将文件复制到输出文件夹
output.copyFile('./myfile.jpg', 'cover.jpg')
    .then(function() { ... });

// 验证文件是否存在
output.hasFile('hello.txt')
    .then(function(exists) { ... });
```

#### Page实例

页实例表示当前解析的页。

```js
// 页面标题（摘自SUMMARY）
page.title

// 页面内容（根据阶段 Markdown/Asciidoc/HTML）
page.content

// 书中的相对路径
page.path

// 文件的绝对路径
page.rawPath

// 用于此文件的分析器类型
page.type ('markdown' or 'asciidoc')
```

#### Blocks和Filters的Context

块和筛选器可以访问同一上下文，此上下文绑定到模板引擎执行：

```js
{
    // 当前模板语法
    "ctx": {
        // 例如：在 {% set message = "hello" %} 之后
        "message": "hello"
    },

    // Book实例
    "book" <Book>,

    // Output 实例
    "output": <Output>
}
```

例如，filter或block函数可以使用 `this.book` 访问当前book。

#### 钩子上下文

钩子只能使用 `this.book` 访问 `<Book>` 实例。
