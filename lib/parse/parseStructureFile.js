var Promise = require('../utils/promise');
var error = require('../utils/error');
var lookupStructureFile = require('./lookupStructureFile');

/**
 * 使用特定方法分析可分析文件
 *
 * @param {FS} fs
 * @param {ParsableFile} file
 * @param {String} type
 * @return {Promise<Array<String, List|Map>>}
 */
function parseFile(fs, file, type) {
    var filepath = file.getPath();
    var parser = file.getParser();

    if (!parser) {
        return Promise.reject(
            error.FileNotParsableError({
                filename: filepath
            })
        );
    }

    return fs.readAsString(filepath)
    .then(function(content) {
        if (type === 'readme') {
            return parser.parseReadme(content);
        } else if (type === 'glossary') {
            return parser.parseGlossary(content);
        } else if (type === 'summary') {
            return parser.parseSummary(content);
        } else if (type === 'langs') {
            return parser.parseLanguages(content);
        } else {
            throw new Error('分析无效类型 "' + type + '",请确保是["glossary", "readme", "summary", "langs"]中之一');
        }
    })
    .then(function(result) {
        return [
            file,
            result
        ];
    });
}

/**
 * 解析结构文件 (例如: SUMMARY.md, GLOSSARY.md).
 * 它使用配置来查找指定的文件。
 *
 * @param {Book} book
 * @param {String} type 其中之一["glossary", "readme", "summary"]
 * @return {Promise<List|Map>}
 */
function parseStructureFile(book, type) {
    var fs = book.getContentFS();

    return lookupStructureFile(book, type)
    .then(function(file) {
        if (!file) return [undefined, undefined];

        return parseFile(fs, file, type);
    });
}

module.exports = parseStructureFile;
