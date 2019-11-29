var Immutable = require('immutable');

/**
    为next/prev编码一篇文章

    @param {Map<String:Page>}
    @param {Article}
    @return {Object}
*/
function encodeArticle(pages, article) {
    var articlePath = article.getPath();

    return {
        path: articlePath,
        title: article.getTitle(),
        level: article.getLevel(),
        exists: (articlePath && pages.has(articlePath)),
        external: article.isExternal()
    };
}

/**
    this.navigation是GBook v2中不推荐使用的属性

    @param {Output}
    @return {Object}
*/
function encodeNavigation(output) {
    var book = output.getBook();
    var pages = output.getPages();
    var summary = book.getSummary();
    var articles = summary.getArticlesAsList();


    var navigation = articles
        .map(function(article, i) {
            var ref = article.getRef();
            if (!ref) {
                return undefined;
            }

            var prev = articles.get(i - 1);
            var next = articles.get(i + 1);

            return [
                ref,
                {
                    index: i,
                    title: article.getTitle(),
                    introduction: (i === 0),
                    prev: prev? encodeArticle(pages, prev) : undefined,
                    next: next? encodeArticle(pages, next) : undefined,
                    level: article.getLevel()
                }
            ];
        })
        .filter(function(e) {
            return Boolean(e);
        });

    return Immutable.Map(navigation).toJS();
}

module.exports = encodeNavigation;
