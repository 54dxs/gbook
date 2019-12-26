var Promise = require('../utils/promise');
var generatePage = require('./generatePage');

/**
    使用生成器输出所有页面

    @param {Generator} generator
    @param {Output} output
    @return {Promise<Output>}
*/
function generatePages(generator, output) {
    /* OrderedMap {
    	"README.md": Record {
    		"file": Record {
    			"path": "README.md",
    			"mtime": Sat Dec 07 2019 11: 09: 34 GMT + 0800(GMT + 08: 00)
    		},
    		"attributes": Map {},
    		"content": "# 介绍\n\n你好，我好，大家好！\n```js\nfunction sayHello(){\n\tconsole.log('哈哈');\n}\n```",
    		"dir": "ltr"
    	},
    	"doc/README1.md": Record {
    		"file":
    		Record {
    			"path": "doc/README1.md",
    			"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
    		},
    		"attributes": Map {},
    		"content": "# 介绍1\n\n",
    		"dir": "ltr"
    	},
    	"README2.md": Record {
    		"file": Record {
    			"path": "README2.md",
    			"mtime": Sat Dec 07 2019 10: 53: 28 GMT + 0800(GMT + 08: 00)
    		},
    		"attributes": Map {},
    		"content": "# 介绍2\n\n哈哈",
    		"dir": "ltr"
    	},
    	"README3.md": Record {
    		"file": Record {
    			"path": "README3.md",
    			"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
    		},
    		"attributes": Map {},
    		"content": "# 介绍3\n\n",
    		"dir": "ltr"
    	},
    	"doc/README4.md": Record {
    		"file": Record {
    			"path": "doc/README4.md",
    			"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
    		},
    		"attributes": Map {},
    		"content": "# 介绍4\n\n",
    		"dir": "ltr"
    	}
    } */
    var pages = output.getPages();
    var logger = output.getLogger();

    if (!generator.onPage) {
        return Promise(output);
    }

    // 遍历pages,分别执行编译生成html页面
    return Promise.reduce(pages, function(out, page) {
        var file = page.getFile();

        logger.debug.ln('生成页面 "' + file.getPath() + '"');

        return generatePage(out, page)
        .then(function(resultPage) {
/*          Record {
            	"file": Record {
            		"path": "README.md",
            		"mtime": Sat Dec 07 2019 11: 09: 34 GMT + 0800(GMT + 08: 00)
            	},
            	"attributes": Map {},
            	"content": "<h1>介绍</h1>\n<p>你好，我好，大家好！</p>\n<pre><code class=\"lang-js\">function sayHello(){\n    console.log(&#39;哈哈&#39;);\n}\n</code></pre>\n",
            	"dir": "ltr"
            }

            Record {
            	"file": Record {
            		"path": "doc/README1.md",
            		"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
            	},
            	"attributes": Map {},
            	"content": "<h1>介绍1</h1>\n",
            	"dir": "ltr"
            }
             */
            return generator.onPage(out, resultPage);
        })
        .fail(function(err) {
            logger.error.ln('生成页时出错 "' + file.getPath() + '":');
            throw err;
        });
    }, output);
}

module.exports = generatePages;
