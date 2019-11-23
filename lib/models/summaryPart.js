var Immutable = require('immutable');

var SummaryArticle = require('./summaryArticle');

/**
 * 部分表示摘要/目录中的节
 */
var SummaryPart = Immutable.Record({
    level:      String(),
    title:      String(),
    articles:   Immutable.List()
});

SummaryPart.prototype.getLevel = function() {
    return this.get('level');
};

SummaryPart.prototype.getTitle = function() {
    return this.get('title');
};

SummaryPart.prototype.getArticles = function() {
    return this.get('articles');
};

/**
 * 为新子项目创建新级别
 *
 * @return {String}
 */
SummaryPart.prototype.createChildLevel = function() {
    var level       = this.getLevel();
    var subArticles = this.getArticles();
    var childLevel  = level + '.' + (subArticles.size + 1);

    return childLevel;
};

/**
 * 创建摘要部分
 *
 * @param {Object} def
 * @return {SummaryPart}
 */
SummaryPart.create = function(def, level) {
    var articles = (def.articles || []).map(function(article, i) {
        if (article instanceof SummaryArticle) {
            return article;
        }
        return SummaryArticle.create(article, [level, i + 1].join('.'));
    });

    return new SummaryPart({
        level: String(level),
        title: def.title,
        articles: Immutable.List(articles)
    });
};

module.exports = SummaryPart;
