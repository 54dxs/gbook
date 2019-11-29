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

    var env = new nunjucks.Environment(
        loader,
        {
            // 转义在asciidoc/markdown解析器之后完成
            autoescape: false,

            // Syntax
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
    filters.forEach(function(filterFn, filterName) {
        env.addFilter(filterName, filterFn.bind(context));
    });

    // Add blocks
    blocks.forEach(function(block) {
        var extName = block.getExtensionName();
        var Ext = block.toNunjucksExt(context, blocksOutput);

        env.addExtension(extName, new Ext());
    });

    // Add globals
    globals.forEach(function(globalValue, globalName) {
        env.addGlobal(globalName, globalValue);
    });

    // Add other extensions
    extensions.forEach(function(ext, extName) {
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
