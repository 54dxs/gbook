var SummaryArticle = require('../../models/summaryArticle');
var SummaryPart = require('../../models/summaryPart');

var indexLevels = require('./indexLevels');

/**
 * 在SUMMARY.md的开头插入一篇文章
 *
 * @param {Summary} summary
 * @param {Article} article
 * @return {Summary}
 */
function unshiftArticle(summary, article) {
    article = SummaryArticle(article);

    var parts = summary.getParts();
    var part = parts.get(0) || SummaryPart();

    var articles = part.getArticles();
    articles = articles.unshift(article);
    part = part.set('articles', articles);

    parts = parts.set(0, part);
    summary = summary.set('parts', parts);

    return indexLevels(summary);
}

module.exports = unshiftArticle;
