var Modifiers = require('./modifiers');
var resolveFileToURL = require('./helper/resolveFileToURL');
var Api = require('../api');
var Plugins = require('../plugins');
var Promise = require('../utils/promise');
var defaultBlocks = require('../constants/defaultBlocks');
var fileToOutput = require('./helper/fileToOutput');

var CODEBLOCK = 'code';

/**
 * 返回默认修饰符以准备用于呈现的页面。
 *
 * @return {Array<Modifier>}
 */
function getModifiers(output, page) {
    var book = output.getBook();
    var plugins = output.getPlugins();
    var glossary = book.getGlossary();
    var file = page.getFile();

    // 词汇表条目
    // entries---> OrderedMap {}
    // glossaryFile---> Record { "path": "", "mtime": "Sat Dec 14 2019 17:08:25 GMT+0800 (GMT+08:00)" }
    // glossaryFilename---> .html
    var entries = glossary.getEntries();
    var glossaryFile = glossary.getFile();
    var glossaryFilename = fileToOutput(output, glossaryFile.getPath());

    // 当前文件路径
    var currentFilePath = file.getPath();

    // 获取用于突出显示的模板块
    // blocks--->Map {
    // 	"code": TemplateBlock {
    // 		"name": "code",
    // 		"end": "",
    // 		"process": function (block) {
    // 			return highlight(block.kwargs.language, block.body);
    // 		},
    // 		"blocks": List[],
    // 		"shortcuts": Map {}
    // 	}
    // }
    // code--->TemplateBlock {
    // 	"name": "code",
    // 	"end": "",
    // 	"process": function (block) {
    // 		return highlight(block.kwargs.language, block.body);
    // 	},
    // 	"blocks": List[],
    // 	"shortcuts": Map {}
    // }
    var blocks = Plugins.listBlocks(plugins);
    var code = blocks.get(CODEBLOCK) || defaultBlocks.get(CODEBLOCK);

    // 当前上下文
    var context = Api.encodeGlobal(output);

    return [
        // 规范化headings上的ID
        Modifiers.addHeadingId,

        // 用glossary条目注释文本
        Modifiers.annotateText.bind(null, entries, glossaryFilename),

        // 解析图像
        Modifiers.resolveImages.bind(null, currentFilePath),

        // 解析链接 (.md -> .html)
        Modifiers.resolveLinks.bind(null,
            currentFilePath,
            resolveFileToURL.bind(null, output)
        ),

        // 使用 "code" 包裹,以高亮显示代码块
        Modifiers.highlightCode.bind(null, function(lang, source) {
            // lang---> js
            // source---> function sayHello(){
            //     console.log('哈哈');
            // }
            return Promise(code.applyBlock({
                body: source,
                kwargs: {
                    language: lang
                }
            }, context))
            .then(function(result) {
                /* result---> {
                  body: '<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sayHello</span>(<span class="hljs-params"></span>)</span>{\n' +
                    `    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'哈哈'</span>);\n` +
                    '}\n',
                  name: 'code'
                } */
                if (result.html === false) {
                    return { text: result.body };
                } else {
                    return { html: result.body };
                }
            });
        })
    ];
}

module.exports = getModifiers;
