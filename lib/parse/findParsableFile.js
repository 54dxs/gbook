var path = require('path');

var Promise = require('../utils/promise');
var parsers = require('../parsers');

/**
 * 在book中找到一个可解析的文件 (Markdown or AsciiDoc)
 *
 * @param {Book} book
 * @param {String} filename (LANGS.md README.md SUMMARY.md GLOSSARY.md)
 * @return {Promise<File | Undefined>}
 */
function findParsableFile(book, filename) {
    var fs = book.getContentFS();
    var ext = path.extname(filename);// 获取到文件的扩展名
    var basename = path.basename(filename, ext);// 不带扩展名的文件名
    var basedir = path.dirname(filename);// 不带文件名的路径名

    // 测试扩展的有序列表['.md', '.markdown', '.mdown', '.adoc', '.asciidoc']
    var exts = parsers.extensions;

    // 根据basename和扩展名的组合文件名,
    // 在basedir目录下遍历查找文件
    // 找到后return出
    return Promise.some(exts, function(ext) {
        var filepath = basename + ext;

        return fs.findFile(basedir, filepath)
        .then(function(found) {
            if (!found || book.isContentFileIgnored(found)) {
                return undefined;
            }
            return fs.statFile(found);
        });
    });
}

module.exports = findParsableFile;
