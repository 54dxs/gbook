var encodeSummaryArticle = require('./encodeSummaryArticle');

/**
    将摘要部分编码为JSON

    @param {SummaryPart}
    @return {Object}
*/
function encodeSummaryPart(part) {
    return {
        title: part.getTitle(),
        articles: part.getArticles()
            .map(encodeSummaryArticle).toJS()
    };
}

module.exports = encodeSummaryPart;
