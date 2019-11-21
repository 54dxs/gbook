var parseStructureFile = require('./parseStructureFile');
var Summary = require('../models/summary');
var SummaryModifier = require('../modifiers').Summary;

/**
    Parse summary in a book, the summary can only be parsed
    if the readme as be detected before.

    @param {Book} book
    @return {Promise<Book>}
*/
/**
 * 分析摘要在一本书中，摘要只能被分析
 * 如果之前检测到readme文件。
 *
 * @param {Book} book
 * @return {Promise<Book>}
 */
function parseSummary(book) {
    var readme = book.getReadme();
    var logger = book.getLogger();
    var readmeFile = readme.getFile();

    return parseStructureFile(book, 'summary')
    .spread(function(file, result) {
        var summary;

        if (!file) {
            logger.warn.ln('在 book 中没有找到 SUMMARY.md 文件');
            summary = Summary();
        } else {
            logger.debug.ln('SUMMARY.md 文件位于', file.getPath());
            summary = Summary.createFromParts(file, result.parts);
        }

        // 如果不是在 SUMMARY.md 中，请将自述文件作为第一个条目插入
        var readmeArticle = summary.getByPath(readmeFile.getPath());

        if (readmeFile.exists() && !readmeArticle) {
            summary = SummaryModifier.unshiftArticle(summary, {
                title: '介绍',
                ref: readmeFile.getPath()
            });
        }

        // 设置新的 summary
        return book.setSummary(summary);
    });
}

module.exports = parseSummary;
