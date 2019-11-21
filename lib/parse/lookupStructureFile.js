var findParsableFile = require('./findParsableFile');

/**
 * 在book中查找结构文件 (例如: SUMMARY.md, GLOSSARY.md)
 * 使用book的配置来查找他
 *
 * @param {Book} book
 * @param {String} type 其中之一 ["glossary", "readme", "summary", "langs"]
 * @return {Promise<File | Undefined>} 找到的文件的路径，相对于book内容根目录。
 */
function lookupStructureFile(book, type) {
    // TODO 本函数执行了2次(readme,summary),有待优化
    var config = book.getConfig();

    var fileToSearch = config.getValue(['structure', type]);

    return findParsableFile(book, fileToSearch);
}

module.exports = lookupStructureFile;
