var path = require('path');
var Immutable = require('immutable');

var markdownParser = require('gbook-markdown');
var asciidocParser = require('gbook-asciidoc');

var EXTENSIONS_MARKDOWN = require('./constants/extsMarkdown');
var EXTENSIONS_ASCIIDOC = require('./constants/extsAsciidoc');
var Parser = require('./models/parser');

/**
 * 此列表按要使用的分析器的优先级排序
 */
var parsers = Immutable.List([
    Parser.create('markdown', EXTENSIONS_MARKDOWN, markdownParser),
    Parser.create('asciidoc', EXTENSIONS_ASCIIDOC, asciidocParser)
]);

/**
 * 按名称返回特定解析器
 *
 * @param {String} name (markdown或者asciidoc)
 * @return {Parser|undefined}
 */
function getParser(name) {
    return parsers.find(function(parser) {
        return parser.getName() === name;
    });
}

/**
 * 根据扩展返回特定的解析器
 *
 * @param {String} ext
 * @return {Parser|undefined}
 */
function getParserByExt(ext) {
    return parsers.find(function(parser) {
        return parser.matchExtension(ext);
    });
}

/**
 * 根据文件名返回特定的解析器
 *
 * @param {String} ext
 * @return {Parser|undefined}
 */
function getParserForFile(filename) {
    return getParserByExt(path.extname(filename));
}

/**
 * 列出所有可拆分扩展,将返回['.md', '.markdown', '.mdown', '.adoc', '.asciidoc']
 * @param {Object} parser
 */
var extensions = parsers
    .map(function(parser) {
        return parser.getExtensions();
    })
    .flatten();

module.exports = {
    extensions: extensions,
    get: getParser,
    getByExt: getParserByExt,
    getForFile: getParserForFile
};
