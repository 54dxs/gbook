var encodeSummaryArticle = require('../json/encodeSummaryArticle');

/**
    编码摘要以向插件提供API

    @param {Output} output
    @param {Config} config
    @return {Object}
*/
function encodeSummary(output, summary) {
    var result = {
        /**
            遍历摘要，当"iter"返回false时停止

            @param {Function} iter
        */
        walk: function (iter) {
            summary.getArticle(function(article) {
                var jsonArticle = encodeSummaryArticle(article, false);

                return iter(jsonArticle);
            });
        },

        /**
            按级别获取文章

            @param {String} level
            @return {Object}
        */
        getArticleByLevel: function(level) {
            var article = summary.getByLevel(level);
            return (article? encodeSummaryArticle(article) : undefined);
        },

        /**
            Get an article by its path

            @param {String} level
            @return {Object}
        */
        getArticleByPath: function(level) {
            var article = summary.getByPath(level);
            return (article? encodeSummaryArticle(article) : undefined);
        }
    };

    return result;
}

module.exports = encodeSummary;
