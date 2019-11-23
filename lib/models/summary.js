var is = require('is');
var Immutable = require('immutable');

var error = require('../utils/error');
var LocationUtils = require('../utils/location');
var File = require('./file');
var SummaryPart = require('./summaryPart');
var SummaryArticle = require('./summaryArticle');
var parsers = require('../parsers');

var Summary = Immutable.Record({
    file:       File(),
    parts:      Immutable.List()
}, 'Summary');

Summary.prototype.getFile = function() {
    return this.get('file');
};

Summary.prototype.getParts = function() {
    return this.get('parts');
};

/**
 * 根据索引返回一个part
 * @param {Number} i
 * @return {Part}
 */
Summary.prototype.getPart = function(i) {
    var parts = this.getParts();
    return parts.get(i);
};

/**
 * 使用迭代器返回一篇文章。
 * 如果设置了 "partIter"，它也可以返回一个Part。
 * @param {Function} iter
 * @param {Function} partIter
 * @return {Article|Part}
*/
Summary.prototype.getArticle = function(iter, partIter) {
    var parts = this.getParts();

    return parts.reduce(function(result, part) {
        if (result) return result;

        if (partIter && partIter(part)) return part;
        return SummaryArticle.findArticle(part, iter);
    }, null);
};

/**
 * 根据level返回 part/article
 * @param {String} level
 * @return {Article|Part}
 */
Summary.prototype.getByLevel = function(level) {
    function iterByLevel(article) {
        return (article.getLevel() === level);
    }

    return this.getArticle(iterByLevel, iterByLevel);
};

/**
 * 根据文件路径返回一个 article
 * @param {String} filePath
 * @return {Article}
 */
Summary.prototype.getByPath = function(filePath) {
    return this.getArticle(function(article) {
        var articlePath = article.getPath();

        return (
            articlePath &&
            LocationUtils.areIdenticalPaths(articlePath, filePath)
        );
    });
};

/**
 * 获取第一篇 article
 * @return {Article}
 */
Summary.prototype.getFirstArticle = function() {
    return this.getArticle(function(article) {
        return true;
    });
};

/**
 * 返回文章的下一篇文章
 * @param {Article} current
 * @return {Article}
 */
Summary.prototype.getNextArticle = function(current) {
    var level = is.string(current)? current : current.getLevel();
    var wasPrev = false;

    return this.getArticle(function(article) {
        if (wasPrev) return true;

        wasPrev = article.getLevel() == level;
        return false;
    });
};

/**
 * 返回文章的前一篇文章
 * @param {Article} current
 * @return {Article}
 */
Summary.prototype.getPrevArticle = function(current) {
    var level = is.string(current)? current : current.getLevel();
    var prev = undefined;

    this.getArticle(function(article) {
        if (article.getLevel() == level) {
            return true;
        }

        prev = article;
        return false;
    });

    return prev;
};

/**
 * 返回父项目或项目的父部分
 * @param {String|Article} level
 * @return {Article|Part|Null}
 */
Summary.prototype.getParent = function (level) {
    // Coerce to level
    level = is.string(level)? level : level.getLevel();

    // Get parent level
    var parentLevel = getParentLevel(level);
    if (!parentLevel) {
        return null;
    }

    // Get parent of the position
    var parentArticle = this.getByLevel(parentLevel);
    return parentArticle || null;
};

/**
 * 摘要呈现为文本
 * @param {String} parseExt 要使用的分析器的扩展
 * @return {Promise<String>}
 */
Summary.prototype.toText = function(parseExt) {
    var file = this.getFile();
    var parts = this.getParts();

    var parser = parseExt? parsers.getByExt(parseExt) : file.getParser();

    if (!parser) {
        throw error.FileNotParsableError({
            filename: file.getPath()
        });
    }

    return parser.renderSummary({
        parts: parts.toJS()
    });
};

/**
 * 将所有文章作为列表返回
 * @return {List<Article>}
 */
Summary.prototype.getArticlesAsList = function() {
    var accu = [];

    this.getArticle(function(article) {
        accu.push(article);
    });

    return Immutable.List(accu);
};

/**
 * 为 parts 列表创建新摘要
 * @param {Object} file
 * @param {Lust|Array} parts
 * @return {Summary}
 */
Summary.createFromParts = function createFromParts(file, parts) {
    parts = parts.map(function(part, i) {
        if (part instanceof SummaryPart) {
            return part;
        }

        return SummaryPart.create(part, i + 1);
    });

    return new Summary({
        file: file,
        parts: new Immutable.List(parts)
    });
};

/**
    Returns parent level of a level

    @param {String} level
    @return {String}
*/
function getParentLevel(level) {
    var parts = level.split('.');
    return parts.slice(0, -1).join('.');
}

module.exports = Summary;
