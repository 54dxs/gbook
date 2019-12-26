var cheerio = require('cheerio');// 同jQuery的一个dom操作库
var Promise = require('../../utils/promise');

/**
    将操作列表应用于页并输出新页。

    @param {Page}
    page--->Record {
    	"file": Record {
    		"path": "README.md",
    		"mtime": Sat Dec 07 2019 11: 09: 34 GMT + 0800(GMT + 08: 00)
    	},
    	"attributes": Map {},
    	"content": "<h1>介绍</h1>\n<p>你好，我好，大家好！</p>\n<pre><code class=\"lang-js\">function sayHello(){\n    console.log(&#39;哈哈&#39;);\n}\n</code></pre>\n",
    	"dir": "ltr"
    }
    page--->Record {
    	"file": Record {
    		"path": "doc/README1.md",
    		"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
    	},
    	"attributes": Map {},
    	"content": "<h1>介绍1</h1>\n",
    	"dir": "ltr"
    }
    page--->Record {
    	"file": Record {
    		"path": "README2.md",
    		"mtime": Sat Dec 07 2019 10: 53: 28 GMT + 0800(GMT + 08: 00)
    	},
    	"attributes": Map {},
    	"content": "<h1>介绍2</h1>\n<p>哈哈</p>\n",
    	"dir": "ltr"
    }
    page--->Record {
    	"file": Record {
    		"path": "README3.md",
    		"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
    	},
    	"attributes": Map {},
    	"content": "<h1>介绍3</h1>\n",
    	"dir": "ltr"
    }
    page--->Record {
    	"file": Record {
    		"path": "doc/README4.md",
    		"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
    	},
    	"attributes": Map {},
    	"content": "<h1>介绍4</h1>\n",
    	"dir": "ltr"
    }

    @param {List|Array<Transformation>}
    operations---> [
      [Function: addHeadingId],
      [Function: bound annotateText],
      [Function: bound resolveImages],
      [Function: bound resolveLinks],
      [Function: bound highlightCode]
    ]
    @return {Promise<Page>}
*/
function modifyHTML(page, operations) {
/*  html---> <h1>介绍</h1>
    <p>你好，我好，大家好！</p>
    <pre><code class="lang-js">function sayHello(){
        console.log(&#39;哈哈&#39;);
    }
    </code></pre>

    html---> <h1>介绍1</h1>

    html---> <h1>介绍2</h1>
    <p>哈哈</p>

    html---> <h1>介绍3</h1>

    html---> <h1>介绍4</h1>
 */
    var html = page.getContent();
    var $ = cheerio.load(html);

    return Promise.forEach(operations, function(op) {
        return op($);
    })
    .then(function() {
/*        resultHTML---> <h1 id="&#x4ECB;&#x7ECD;">&#x4ECB;&#x7ECD;</h1>
        <p>&#x4F60;&#x597D;&#xFF0C;&#x6211;&#x597D;&#xFF0C;&#x5927;&#x5BB6;&#x597D;&#xFF01;</p>
        <pre><code class="lang-js"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sayHello</span>(<span class="hljs-params"></span>)</span>{
            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">&apos;&#x54C8;&#x54C8;&apos;</span>);
        }
        </code></pre>

        resultHTML---> <h1 id="&#x4ECB;&#x7ECD;1">&#x4ECB;&#x7ECD;1</h1>

        resultHTML---> <h1 id="&#x4ECB;&#x7ECD;2">&#x4ECB;&#x7ECD;2</h1>
        <p>&#x54C8;&#x54C8;</p>

        resultHTML---> <h1 id="&#x4ECB;&#x7ECD;3">&#x4ECB;&#x7ECD;3</h1>

        resultHTML---> <h1 id="&#x4ECB;&#x7ECD;4">&#x4ECB;&#x7ECD;4</h1> */
        var resultHTML = $.html();
        return page.set('content', resultHTML);
    });
}

module.exports = modifyHTML;
