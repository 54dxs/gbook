var Immutable = require('immutable');

var location = require('../utils/location');

/**
 * 项目表示摘要/目录中的条目
 */
var SummaryArticle = Immutable.Record({
    level:      String(),
    title:      String(),
    ref:        String(),
    articles:   Immutable.List()
}, 'SummaryArticle');

SummaryArticle.prototype.getLevel = function() {
    return this.get('level');
};

SummaryArticle.prototype.getTitle = function() {
    return this.get('title');
};

SummaryArticle.prototype.getRef = function() {
    return this.get('ref');
};

SummaryArticle.prototype.getArticles = function() {
    return this.get('articles');
};

/**
 * 返回文章的深度。
 * 自述文件的深度为1
 *
 * @return {Number}
 */
SummaryArticle.prototype.getDepth = function() {
    return (this.getLevel().split('.').length - 1);
};

/**
 * 获取指向文件的路径（不带定位点）。
 * 它还规范化文件路径。
 *
 * @return {String}
 */
SummaryArticle.prototype.getPath = function() {
    if (this.isExternal()) {
        return undefined;
    }

    var ref = this.getRef();
    if (!ref) {
        return undefined;
    }

    var parts = ref.split('#');

    var pathname = (parts.length > 1? parts.slice(0, -1).join('#') : ref);

    // 规范化要删除的路径 ('./', '/...', etc)
    return location.flatten(pathname);
};

/**
 * 如果项目是外部的，则返回url
 *
 * @return {String}
 */
SummaryArticle.prototype.getUrl = function() {
    return this.isExternal()? this.getRef() : undefined;
};

/**
 * 获取此文章的锚（或未定义的锚）
 *
 * @return {String}
 */
SummaryArticle.prototype.getAnchor = function() {
    var ref = this.getRef();
    var parts = ref.split('#');

    var anchor = (parts.length > 1? '#' + parts[parts.length - 1] : undefined);
    return anchor;
};

/**
 * 为新子项目创建新级别
 *
 * @return {String}
 */
SummaryArticle.prototype.createChildLevel = function() {
    var level       = this.getLevel();
    var subArticles = this.getArticles();
    var childLevel  = level + '.' + (subArticles.size + 1);

    return childLevel;
};

/**
 * 文章是否指向绝对url的页面
 *
 * @return {Boolean}
 */
SummaryArticle.prototype.isPage = function() {
    return !this.isExternal() && this.getRef();
};

/**
 * 检查本文是否为文件（exatly）
 *
 * @param {File} file
 * @return {Boolean}
 */
SummaryArticle.prototype.isFile = function(file) {
    return (
        file.getPath() === this.getPath()
        && this.getAnchor() === undefined
    );
};

/**
 * 检查这篇文章是否是这本书的介绍
 *
 * @param {Book|Readme} book
 * @return {Boolean}
 */
SummaryArticle.prototype.isReadme = function(book) {
    var readme = book.getFile? book : book.getReadme();
    var file = readme.getFile();

    return this.isFile(file);
};

/**
 * 文章是否指向aan绝对url
 *
 * @return {Boolean}
 */
SummaryArticle.prototype.isExternal = function() {
    return location.isExternal(this.getRef());
};

/**
 * 创建一个SummaryArticle
 *
 * @param {Object} def
 * @return {SummaryArticle}
 */
SummaryArticle.create = function(def, level) {
    var articles = (def.articles || []).map(function(article, i) {
        if (article instanceof SummaryArticle) {
            return article;
        }
        return SummaryArticle.create(article, [level, i + 1].join('.'));
    });

    return new SummaryArticle({
        level: level,
        title: def.title,
        ref: def.ref || def.path || '',
        articles: Immutable.List(articles)
    });
};

/**
 * 从底稿中找一篇文章
 *
 * @param {Article|Part} base
 * @param {Function(article)} iter
 * @return {Article}
 */
SummaryArticle.findArticle = function(base, iter) {
    var articles = base.getArticles();

    return articles.reduce(function(result, article) {
        if (result) return result;

        if (iter(article)) {
            return article;
        }

        return SummaryArticle.findArticle(article, iter);
    }, null);
};


module.exports = SummaryArticle;
