var nunjucks = require('nunjucks');
var Immutable = require('immutable');

// 模板引擎
var TemplateEngine = Immutable.Record({
    // Map of {TemplateBlock}
    blocks:     Immutable.Map(),

    // Map of Extension
    extensions: Immutable.Map(),

    // Map of filters: {String} name -> {Function} fn
    filters:    Immutable.Map(),

    // Map of globals: {String} name -> {Mixed}
    globals:    Immutable.Map(),

    // Context for filters / blocks
    context:    Object(),

    // Nunjucks loader
    loader:     nunjucks.FileSystemLoader('views')
}, 'TemplateEngine');

TemplateEngine.prototype.getBlocks = function() {
    return this.get('blocks');
};

TemplateEngine.prototype.getGlobals = function() {
    return this.get('globals');
};

TemplateEngine.prototype.getFilters = function() {
    return this.get('filters');
};

TemplateEngine.prototype.getShortcuts = function() {
    return this.get('shortcuts');
};

TemplateEngine.prototype.getLoader = function() {
    return this.get('loader');
};

TemplateEngine.prototype.getContext = function() {
    return this.get('context');
};

TemplateEngine.prototype.getExtensions = function() {
    return this.get('extensions');
};

/**
    按block名返回block（或undefined）

    @param {String} name
    @return {TemplateBlock}
*/
TemplateEngine.prototype.getBlock = function(name) {
    var blocks = this.getBlocks();
    return blocks.find(function(block) {
        return block.getName() === name;
    });
};

/**
    从此配置返回一个nunjucks环境

    @return {Nunjucks.Environment}
*/
TemplateEngine.prototype.toNunjucks = function(blocksOutput) {
    var loader = this.getLoader();
    var blocks = this.getBlocks();
    var filters = this.getFilters();
    var globals = this.getGlobals();
    var extensions = this.getExtensions();
    var context = this.getContext();

    /* loader---> new_cls {
      rootFolder: 'D:\\GitHub\\node\\testbook',
      transformFn: function () { [native code] },
      logger: Logger {
        _write: function(msg) {
                  if(process.stdout) {
                    process.stdout.write(msg);
                  }
                },
        lastChar: '\n',
        logLevel: 1,
        debug: [Function: bound ] {
          ln: [Function: bound ],
          ok: [Function: bound ],
          fail: [Function: bound ],
          promise: [Function: bound ]
        },
        info: [Function: bound ] {
          ln: [Function: bound ],
          ok: [Function: bound ],
          fail: [Function: bound ],
          promise: [Function: bound ]
        },
        warn: [Function: bound ] {
          ln: [Function: bound ],
          ok: [Function: bound ],
          fail: [Function: bound ],
          promise: [Function: bound ]
        },
        error: [Function: bound ] {
          ln: [Function: bound ],
          ok: [Function: bound ],
          fail: [Function: bound ],
          promise: [Function: bound ]
        }
      },
      git: Git { cloned: {} }
    }

    loader---> List {
      size: 8,
      _origin: 0,
      _capacity: 8,
      _level: 5,
      _root: null,
      _tail: VNode {
        array: [
          'D:\\GitHub\\node\\testbook\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-livereload\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-highlight\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-search\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-lunr\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-sharing\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-fontsettings\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-theme-default\\_layouts'
        ],
        ownerID: undefined
      },
      __ownerID: undefined,
      __hash: undefined,
      __altered: false
    } */

    // 参数loader异步加载程序, 参数二是一个参数列表
    var env = new nunjucks.Environment(
        loader,
        {
            // 转义在asciidoc/markdown解析器之后完成
            /* 自动转义 (Autoescaping)
            如果在环境变量中设置了 autoescaping，所有的输出都会自动转义，但可以使用 safe 过滤器，Nunjucks 就不会转义了。

            {{ foo }}           // &lt;span%gt;
            {{ foo | safe }}    // <span>
            如果未开启 autoescaping，所有的输出都会如实输出，但可以使用 escape 过滤器来转义。

            {{ foo }}           // <span>
            {{ foo | escape }}  // &lt;span&gt; */
            autoescape: false,// autoescape (默认值: true) 控制输出是否被转义
            trimBlocks: true,// trimBlocks (default: false) 自动去除 block/tag 后面的换行符
            lstripBlocks: true,// lstripBlocks (default: false) 自动去除 block/tag 签名的空格

            // 句法规则
            tags: {
                blockStart: '{%',
                blockEnd: '%}',
                variableStart: '{{',
                variableEnd: '}}',
                commentStart: '{###',
                commentEnd: '###}'
            }
        }
    );

    // Add filters
    /* filters--->Map {
    	"date": function (time, format) {
    		return moment(time).format(format);
    	},
    	"dateFromNow": function (time) {
    		return moment(time).fromNow();
    	},
    	"t": function t(s) {
    		return i18n.t(language, s);
    	},
    	"resolveFile": function (filePath) {
    		filePath = resolveFileToURL(output, filePath);
    		return LocationUtils.relativeForFile(currentFile, filePath);
    	},
    	"resolveAsset": function (filePath) {
    		filePath = LocationUtils.toAbsolute(filePath, '', '');
    		filePath = path.join('gitbook', filePath);
    		filePath = LocationUtils.relativeForFile(currentFile, filePath);

    		// Use assets from parent if language book
    		if (book.isLanguageBook()) {
    			filePath = path.join('../', filePath);
    		}

    		return LocationUtils.normalize(filePath);
    	},
    	"fileExists": function () {
    		logNotice(book, key, msg);

    		return fn.apply(this, arguments);
    	},
    	"getArticleByPath": function () {
    		logNotice(book, key, msg);

    		return fn.apply(this, arguments);
    	},
    	"contentURL": function (filePath) {
    		return fileToURL(output, filePath);
    	}
    } */
    filters.forEach(function(filterFn, filterName) {
        env.addFilter(filterName, filterFn.bind(context));
    });

    /* blocks--->Map {
        "html": TemplateBlock {
            "name": "html",
            "end": "",
            "process": function(blk) {
                return blk;
            },
            "blocks": List[],
            "shortcuts": Map {}
        },
        "code": TemplateBlock {
            "name": "code",
            "end": "",
            "process": function (block) {
                return highlight(block.kwargs.language, block.body);
            },
            "blocks": List[],
            "shortcuts": Map {}
        },
        "markdown": TemplateBlock {
            "name": "markdown",
            "end": "",
            "process": function (blk) {
                return this.book.renderInline('markdown', blk.body)
                .then(function (out) {
                    return {
                        body: out
                    };
                });
            },
            "blocks": List[],
            "shortcuts": Map {}
        },
        "asciidoc": TemplateBlock {
            "name": "asciidoc",
            "end": "",
            "process": function (blk) {
                return this.book.renderInline('asciidoc', blk.body)
                .then(function (out) {
                    return {
                        body: out
                    };
                });
            },
            "blocks": List[],
            "shortcuts": Map {}
        },
        "markup": TemplateBlock {
            "name": "markup",
            "end": "",
            "process": function (blk) {
                return this.book.renderInline(this.ctx.file.type, blk.body)
                .then(function (out) {
                    return {
                        body: out
                    };
                });
            },
            "blocks": List[],
            "shortcuts": Map {}
        }
    } */
    // Add blocks
    blocks.forEach(function(block) {
        var extName = block.getExtensionName();
        var Ext = block.toNunjucksExt(context, blocksOutput);

        env.addExtension(extName, new Ext());
    });

    // Add globals
    /* globals--->Map {
    	"getArticleByPath": function getArticleByPath(filePath) {
    		var article = summary.getByPath(filePath);
    		if (!article)
    			return undefined;
    		return JSONUtils.encodeSummaryArticle(article);
    	},
    	"getPageByPath": function getPageByPath(filePath) {
    		var page = output.getPage(filePath);
    		if (!page)
    			return undefined;
    		return JSONUtils.encodePage(page, summary);
    	},
    	"fileExists": function fileExists(fileName) {
    		if (!fileName) {
    			return false;
    		}
    		var filePath = PathUtils.resolveInRoot(outputFolder, fileName);
    		return fs.existsSync(filePath);
    	}
    } */
    globals.forEach(function(globalValue, globalName) {
        env.addGlobal(globalName, globalValue);
    });

    // Add other extensions
    /* extensions--->DoExtension {
    	tags: ['do'],
    	parse: function(parser, nodes, lexer) {
    		var tok = parser.nextToken();
    		var args = parser.parseSignature(null, true);
    		parser.advanceAfterBlockEnd(tok.value);
    		var body = parser.parseUntilBlocks('enddo');
    		parser.advanceAfterBlockEnd();
    		return new nodes.CallExtension(this, 'run', args, [body]);
    	},
    	run: function(context, body) {
    		var js = body();
    		vm.runInNewContext(js, context.ctx);
    		return '';
    	}
    } */
    extensions.forEach(function(ext, extName) {
        // extName---> DoExtension
        // ext---> DoExtension { tags: [ 'do' ], parse: [Function], run: [Function] }
        env.addExtension(extName, ext);
    });

    return env;
};

/**
    创建模板引擎

    @param {Object} def
    @return {TemplateEngine}
*/
TemplateEngine.create = function(def) {
    return new TemplateEngine({
        blocks:     Immutable.List(def.blocks || []),
        extensions: Immutable.Map(def.extensions || {}),
        filters:    Immutable.Map(def.filters || {}),
        globals:    Immutable.Map(def.globals || {}),
        context:    def.context,
        loader:     def.loader
    });
};

module.exports = TemplateEngine;
