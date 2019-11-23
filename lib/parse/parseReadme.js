var parseStructureFile = require('./parseStructureFile');
var Readme = require('../models/readme');

var error = require('../utils/error');

/**
 * 从book中分析readme文件
 *
 * @param {Book} book
 * @return {Promise<Book>}
 */
function parseReadme(book) {
    var logger = book.getLogger();

    return parseStructureFile(book, 'readme')
    .spread(function(file, result) {
        if (!file) {
            throw new error.FileNotFoundError({ filename: 'README' });
        }

        logger.debug.ln('readme 文件位于', file.getPath());

        var readme = Readme.create(file, result);
        return book.set('readme', readme);
    });
}

module.exports = parseReadme;
