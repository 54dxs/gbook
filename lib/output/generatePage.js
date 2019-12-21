var path = require('path');

var Promise = require('../utils/promise');
var error = require('../utils/error');
var timing = require('../utils/timing');

var Templating = require('../templating');
var JSONUtils = require('../json');
var createTemplateEngine = require('./createTemplateEngine');
var callPageHook = require('./callPageHook');

/**
 * 为页面准备并生成HTML
 *
 * @param {Output} output
 * @param {Page} page
 * @return {Promise<Page>}
 */
function generatePage(output, page) {
    var book = output.getBook();
    var engine = createTemplateEngine(output);

    return timing.measure(
        'page.generate',
        Promise(page)
        .then(function(resultPage) {
            var file = resultPage.getFile();
            var filePath = file.getPath();// README.md
            var parser = file.getParser();
            var context = JSONUtils.encodeOutputWithPage(output, resultPage);// 生成一个json格式的结构文件

            if (!parser) {
                return Promise.reject(error.FileNotParsableError({
                    filename: filePath
                }));
            }

            // Call hook "page:before"
            return callPageHook('page:before', output, resultPage)

            // 使用原始标记转义代码块
            .then(function(currentPage) {
                /*```js
                function sayHello(){
                    console.log('哈哈');
                }
                ```
                经过parser.preparePage()转化后为如下
                {% raw %}```js
                function sayHello(){
                    console.log('哈哈');
                }
                ```{% endraw %} */
                // gbook-markdown->page.js->preparePage(src)
                return parser.preparePage(currentPage.getContent());
            })

            // 渲染模板语法
            .then(function(content) {
                // D:\GitHub\node\testbook\README.md
                var absoluteFilePath = path.join(book.getContentRoot(), filePath);
                return Templating.render(engine, absoluteFilePath, content, context);
            })

            .then(function(output) {
                var content = output.getContent();

                // gbook-html->page.js->parsePage(html)
                return parser.parsePage(content)
                .then(function(result) {
                    // result---> {
                    //   content: '<h1>介绍</h1>\n' +
                    //     '<p>你好，我好，大家好！</p>\n' +
                    //     '<pre><code class="lang-js">function sayHello(){\n' +
                    //     '    console.log(&#39;哈哈&#39;);\n' +
                    //     '}\n' +
                    //     '</code></pre>\n'
                    // }
                    return output.setContent(result.content);
                });
            })

            // 模板语法的后处理
            .then(function(output) {
                return Templating.postRender(engine, output);
            })

            // 返回一个新的page
            .then(function(content) {
                // content---> <h1>介绍</h1>
                // <p>你好，我好，大家好！</p>
                // <pre><code class="lang-js">function sayHello(){
                //     console.log(&#39;哈哈&#39;);
                // }
                // </code></pre>

                return resultPage.set('content', content);
            })

            // Call final hook
            .then(function(currentPage) {
                return callPageHook('page', output, currentPage);
            });
        })
    );
}

module.exports = generatePage;
