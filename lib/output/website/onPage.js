var path = require('path');
var omit = require('omit-keys');

var Templating = require('../../templating');
var Plugins = require('../../plugins');
var JSONUtils = require('../../json');
var LocationUtils = require('../../utils/location');
var Modifiers = require('../modifiers');
var writeFile = require('../helper/writeFile');
var getModifiers = require('../getModifiers');
var createTemplateEngine = require('./createTemplateEngine');
var fileToOutput = require('../helper/fileToOutput');

/**
 * 将页面作为json文件编写
 *
 * @param {Output} output
 * @param {Page} page
 */
function onPage(output, page) {
/*  options---> Record {
    	"root": "D:\\GitHub\\node\\testbook\\_book",
    	"prefix": "website",
    	"directoryIndex": true
    } */
    var options   = output.getOptions();
    var prefix    = options.get('prefix');// website

/*    file--->Record {
        "path": "README.md",
        "mtime": Sat Dec 07 2019 11: 09: 34 GMT + 0800(GMT + 08: 00)
    } */
    var file      = page.getFile();

/* state--->Record {
	"i18n": [object Object],
	"resources": Map {
		"livereload": Map{
			"assets": "./book",
			"js": List["plugin.js"]
		},
		"highlight": Map {
			"assets": "./css",
			"css": List["website.css"]
		},
		"search": Map {
			"assets": "./assets",
			"js": List["search-engine.js", "search.js"],
			"css": List["search.css"]
		},
		"lunr": Map {
			"assets": "./assets",
			"js": List["lunr.min.js", "search-lunr.js"]
		},
		"sharing": Map {
			"assets": "./assets",
			"js": List["buttons.js"]
		},
		"fontsettings": Map {
			"assets": "./assets",
			"js": List["fontsettings.js"],
			"css": List["website.css"]
		},
		"theme-default": Map {}
	}
} */
    var book      = output.getBook();
    var plugins   = output.getPlugins();
    var state     = output.getState();
    var resources = state.getResources();

    // page.getPath()---> README.md
    var engine = createTemplateEngine(output, page.getPath());

    // 输出文件路径
    // file.getPath()---> README.md
    // filePath---> index.html
    // filePath---> doc/README1.html
    // filePath---> README2.html
    // filePath---> README3.html
    // filePath---> doc/README4.html
    var filePath = fileToOutput(output, file.getPath());

    // 计算到root的相对路径
    // outputDirName---> .
    // basePath---> .
    // outputDirName---> doc
    // basePath---> ..
    // outputDirName---> .
    // basePath---> .
    // outputDirName---> .
    // basePath---> .
    // outputDirName---> doc
    // basePath---> ..
    var outputDirName = path.dirname(filePath);
    var basePath = LocationUtils.normalize(path.relative(outputDirName, './'));

    // getModifiers(output, page)---> [
    //   [Function: addHeadingId],
    //   [Function: bound annotateText],
    //   [Function: bound resolveImages],
    //   [Function: bound resolveLinks],
    //   [Function: bound highlightCode]
    // ]
    return Modifiers.modifyHTML(page, getModifiers(output, page))
    .then(function(resultPage) {
        /* resultPage--->Record {
        	"file": Record {
        		"path": "README3.md",
        		"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
        	},
        	"attributes": Map {},
        	"content": "<h1 id=\"&#x4ECB;&#x7ECD;3\">&#x4ECB;&#x7ECD;3</h1>\n",
        	"dir": "ltr"
        }
        resultPage--->Record {
        	"file": Record {
        		"path": "doc/README4.md",
        		"mtime": Tue Nov 26 2019 17: 28: 35 GMT + 0800(GMT + 08: 00)
        	},
        	"attributes": Map {},
        	"content": "<h1 id=\"&#x4ECB;&#x7ECD;4\">&#x4ECB;&#x7ECD;4</h1>\n",
        	"dir": "ltr"
        } */
        /* context---> {
          summary: {
            file: {
              path: 'SUMMARY.md',
              mtime: 2019-11-26T11:52:20.920Z,
              type: 'markdown'
            },
            parts: [ [Object] ]
          },
          glossary: { file: undefined, entries: {} },
          readme: {
            file: {
              path: 'README.md',
              mtime: 2019-12-15T00:27:17.905Z,
              type: 'markdown'
            }
          },
          config: {
            gitbook: '*',
            theme: 'default',
            variables: {},
            plugins: [ 'livereload' ],
            pluginsConfig: {
              livereload: {},
              highlight: {},
              search: {},
              lunr: [Object],
              sharing: [Object],
              fontsettings: [Object],
              'theme-default': [Object]
            },
            structure: {
              langs: 'LANGS.md',
              readme: 'README.md',
              glossary: 'GLOSSARY.md',
              summary: 'SUMMARY.md'
            },
            pdf: {
              pageNumbers: true,
              fontSize: 12,
              fontFamily: 'Arial',
              paperSize: 'a4',
              chapterMark: 'pagebreak',
              pageBreaksBefore: '/',
              margin: [Object]
            },
            styles: {
              website: 'styles/website.css',
              pdf: 'styles/pdf.css',
              epub: 'styles/epub.css',
              mobi: 'styles/mobi.css',
              ebook: 'styles/ebook.css',
              print: 'styles/print.css'
            }
          },
          languages: undefined,
          gitbook: { version: '3.4.2', time: 2019-12-15T00:30:19.898Z },
          book: { language: undefined },
          output: { name: 'website' },
          options: {
            root: 'D:\\GitHub\\node\\testbook\\_book',
            prefix: 'website',
            directoryIndex: true
          },
          page: {
            title: '介绍4',
            level: '1.3',
            depth: 1,
            previous: {
              title: '介绍3',
              level: '1.2.1',
              depth: 2,
              anchor: undefined,
              url: undefined,
              path: 'README3.md',
              ref: 'README3.md',
              articles: []
            },
            content: '<h1 id="&#x4ECB;&#x7ECD;4">&#x4ECB;&#x7ECD;4</h1>\n',
            dir: 'ltr'
          },
          file: {
            path: 'doc/README4.md',
            mtime: 2019-11-26T09:28:35.354Z,
            type: 'markdown'
          }
        } */
        // 生成上下文
        var context = JSONUtils.encodeOutputWithPage(output, resultPage);
        context.plugins = {
            resources: Plugins.listResources(plugins, resources).toJS()
        };
        /* context.plugins.resources---> {
          js: [
            { path: 'gitbook-plugin-livereload/plugin.js' },
            { path: 'gitbook-plugin-search/search-engine.js' },
            { path: 'gitbook-plugin-search/search.js' },
            { path: 'gitbook-plugin-lunr/lunr.min.js' },
            { path: 'gitbook-plugin-lunr/search-lunr.js' },
            { path: 'gitbook-plugin-sharing/buttons.js' },
            { path: 'gitbook-plugin-fontsettings/fontsettings.js' }
          ],
          css: [
            { path: 'gitbook-plugin-highlight/website.css' },
            { path: 'gitbook-plugin-search/search.css' },
            { path: 'gitbook-plugin-fontsettings/website.css' }
          ]
        } */

        context.template = {
            getJSContext: function() {
                return {
                    page: omit(context.page, 'content'),
                    config: context.config,
                    file: context.file,
                    gitbook: context.gitbook,
                    basePath: basePath,
                    book: {
                        language: book.getLanguage()
                    }
                };
            }
        };

        // 我们应该把它移到"template"或"site"名称空间
        context.basePath = basePath;

        // 呈现主题
        return Templating.renderFile(engine, prefix + '/page.html', context)

        // 写入磁盘
        .then(function(tplOut) {
            /* tplOut--->TemplateOutput {
            	"content": "\n<!DOCTYPE HTML>\n<html lang=\"\" >\n  <head>\n        <meta charset=\"UTF-8\">\n        <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\">\n        <title>介绍4 · GitBook</title>\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n   <meta name=\"description\" content=\"\">\n        <meta name=\"generator\" content=\"GitBook 3.4.2\">\n        \n        \n        \n    \n    <link rel=\"stylesheet\" href=\"../gitbook/style.css\">\n\n    \n            \n \n                <link rel=\"stylesheet\" href=\"../gitbook/gitbook-plugin-highlight/website.css\">\n                \n            \n                \n         <link rel=\"stylesheet\" href=\"../gitbook/gitbook-plugin-search/search.css\">\n                \n            \n                \n                <link rel=\"stylesheet\" href=\"../gitbook/gitbook-plugin-fontsettings/website.css\">\n                \n            \n        \n\n    \n\n    \n        \n    \n    \n    \n        \n    \n        \n    \n        \n    \n        \n    \n\n      \n    \n    \n    <meta name=\"HandheldFriendly\" content=\"true\"/>\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, user-scalable=no\">\n    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">\n    <link rel=\"apple-touch-icon-precomposed\" sizes=\"152x152\" href=\"../gitbook/images/apple-touch-icon-precomposed-152.png\">\n    <link rel=\"shortcut icon\" href=\"../gitbook/images/favicon.ico\" type=\"image/x-icon\">\n\n    \n    \n    <link rel=\"prev\" href=\"../README3.html\" />\n    \n\n    </head>\n    <body>\n        \n<div class=\"book\">\n    <div class=\"book-summary\">\n        \n        \n<div id=\"book-search-input\" role=\"search\">\n    <input type=\"text\" placeholder=\"Type to search\" />\n</div>\n\n            \n                <nav role=\"navigation\">\n                \n\n\n<ul class=\"summary\">\n    \n \n\n    \n\n    \n        \n        \n    \n        <li class=\"chapter \" data-level=\"1.1\" data-path=\"../\">\n            \n                <a href=\"../\">\n            \n                    \n                    介绍\n            \n               </a>\n            \n\n            \n            <ul class=\"articles\">\n                \n    \n        <li class=\"chapter \" data-level=\"1.1.1\" data-path=\"README1.html\">\n            \n                <a href=\"README1.html\">\n            \n                    \n                    介绍1\n     \n                </a>\n            \n\n            \n        </li>\n    \n\n            </ul>\n            \n        </li>\n    \n        <li class=\"chapter \" data-level=\"1.2\" data-path=\"../README2.html\">\n            \n        <a href=\"../README2.html\">\n            \n                    \n              介绍2\n            \n                </a>\n            \n\n     \n            <ul class=\"articles\">\n                \n    \n        <li class=\"chapter \" data-level=\"1.2.1\" data-path=\"../README3.html\">\n    \n                <a href=\"../README3.html\">\n            \n      \n                    介绍3\n            \n                </a>\n   \n\n            \n        </li>\n    \n\n            </ul>\n            \n     </li>\n    \n        <li class=\"chapter active\" data-level=\"1.3\" data-path=\"README4.html\">\n            \n                <a href=\"README4.html\">\n            \n                    \n                    介绍4\n            \n             </a>\n            \n\n            \n        </li>\n    \n\n    \n\n    <li class=\"divider\"></li>\n\n    <li>\n        <a href=\"https://www.gitbook.com\" target=\"blank\" class=\"gitbook-link\">\n            Published with GitBook\n        </a>\n    </li>\n</ul>\n\n\n                </nav>\n            \n        \n    </div>\n\n    <div class=\"book-body\">\n        \n            <div class=\"body-inner\">\n                \n                    \n\n<div class=\"book-header\" role=\"navigation\">\n    \n\n    <!-- Title -->\n    <h1>\n   <i class=\"fa fa-circle-o-notch fa-spin\"></i>\n        <a href=\"..\" >介绍4</a>\n    </h1>\n</div>\n\n\n\n\n                    <div class=\"page-wrapper\" tabindex=\"-1\" role=\"main\">\n                        <div class=\"page-inner\">\n                            \n<div id=\"book-search-results\">\n    <div class=\"search-noresults\">\n    \n                                <section class=\"normal markdown-section\">\n                                \n                <h1 id=\"&#x4ECB;&#x7ECD;4\">&#x4ECB;&#x7ECD;4</h1>\n\n                       \n                                </section>\n                 \n    </div>\n    <div class=\"search-results\">\n        <div class=\"has-results\">\n            \n            <h1 class=\"search-results-title\"><span class='search-results-count'></span> results matching \"<span class='search-query'></span>\"</h1>\n            <ul class=\"search-results-list\"></ul>\n            \n        </div>\n        <div class=\"no-results\">\n \n            <h1 class=\"search-results-title\">No results matching \"<span class='search-query'></span>\"</h1>\n            \n        </div>\n    </div>\n</div>\n\n                        </div>\n                    </div>\n   \n            </div>\n\n            \n                \n                <a href=\"../README3.html\" class=\"navigation navigation-prev navigation-unique\" aria-label=\"Previous page: 介绍3\">\n                    <i class=\"fa fa-angle-left\"></i>\n                </a>\n                \n                \n  \n        \n    </div>\n\n    <script>\n        var gitbook = gitbook || [];\n        gitbook.push(function() {\n            gitbook.page.hasChanged({\"page\":{\"title\":\"介绍4\",\"level\":\"1.3\",\"depth\":1,\"previous\":{\"title\":\"介绍3\",\"level\":\"1.2.1\",\"depth\":2,\"path\":\"README3.md\",\"ref\":\"README3.md\",\"articles\":[]},\"dir\":\"ltr\"},\"config\":{\"gitbook\":\"*\",\"theme\":\"default\",\"variables\":{},\"plugins\":[\"livereload\"],\"pluginsConfig\":{\"livereload\":{},\"highlight\":{},\"search\":{},\"lunr\":{\"maxIndexSize\":1000000,\"ignoreSpecialCharacters\":false},\"sharing\":{\"facebook\":true,\"twitter\":true,\"google\":false,\"weibo\":false,\"instapaper\":false,\"vk\":false,\"all\":[\"facebook\",\"google\",\"twitter\",\"weibo\",\"instapaper\"]},\"fontsettings\":{\"theme\":\"white\",\"family\":\"sans\",\"size\":2},\"theme-default\":{\"styles\":{\"website\":\"styles/website.css\",\"pdf\":\"styles/pdf.css\",\"epub\":\"styles/epub.css\",\"mobi\":\"styles/mobi.css\",\"ebook\":\"styles/ebook.css\",\"print\":\"styles/print.css\"},\"showLevel\":false}},\"structure\":{\"langs\":\"LANGS.md\",\"readme\":\"README.md\",\"glossary\":\"GLOSSARY.md\",\"summary\":\"SUMMARY.md\"},\"pdf\":{\"pageNumbers\":true,\"fontSize\":12,\"fontFamily\":\"Arial\",\"paperSize\":\"a4\",\"chapterMark\":\"pagebreak\",\"pageBreaksBefore\":\"/\",\"margin\":{\"right\":62,\"left\":62,\"top\":56,\"bottom\":56}},\"styles\":{\"website\":\"styles/website.css\",\"pdf\":\"styles/pdf.css\",\"epub\":\"styles/epub.css\",\"mobi\":\"styles/mobi.css\",\"ebook\":\"styles/ebook.css\",\"print\":\"styles/print.css\"}},\"file\":{\"path\":\"doc/README4.md\",\"mtime\":\"2019-11-26T09:28:35.354Z\",\"type\":\"markdown\"},\"gitbook\":{\"version\":\"3.4.2\",\"time\":\"2019-12-15T00:53:38.642Z\"},\"basePath\":\"..\",\"book\":{\"language\":\"\"}});\n        });\n    </script>\n</div>\n\n        \n    <script src=\"../gitbook/gitbook.js\"></script>\n    <script src=\"../gitbook/theme.js\"></script>\n\n        \n        <script src=\"../gitbook/gitbook-plugin-livereload/plugin.js\"></script>\n        \n    \n        \n        <script src=\"../gitbook/gitbook-plugin-search/search-engine.js\"></script>\n        \n    \n        \n        <script src=\"../gitbook/gitbook-plugin-search/search.js\"></script>\n        \n   \n        \n        <script src=\"../gitbook/gitbook-plugin-lunr/lunr.min.js\"></script>\n        \n    \n        \n        <script src=\"../gitbook/gitbook-plugin-lunr/search-lunr.js\"></script>\n        \n    \n        \n        <script src=\"../gitbook/gitbook-plugin-sharing/buttons.js\"></script>\n        \n\n        \n        <script src=\"../gitbook/gitbook-plugin-fontsettings/fontsettings.js\"></script>\n        \n    \n\n    </body>\n</html>\n\n",
            	"blocks": Map {}
            } */
            return writeFile(output, filePath, tplOut.getContent());
        });
    });
}

module.exports = onPage;
