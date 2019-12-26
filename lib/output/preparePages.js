var Parse = require('../parse');
var Promise = require('../utils/promise');

/**
 * 列出并准备所有页面
 * @param {Output} output
 * @return {Promise<Output>}
 */
function preparePages(output) {
    var book = output.getBook();
    var logger = book.getLogger();

    if (book.isMultilingual()) {
        return Promise(output);
    }

    return Parse.parsePagesList(book)
    .then(function(pages) {
        logger.info.ln('找到', pages.size, '个页面');

        return output.set('pages', pages);
    });
}

module.exports = preparePages;
