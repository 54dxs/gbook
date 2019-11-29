var encodeOutput = require('./encodeOutput');
var encodePage = require('./encodePage');
var encodeFile = require('./encodeFile');

/**
 * 将输出编码为page
 *
 * @param {Book} output
 * @param {Page} page
 * @return {Object}
 */
function encodeOutputWithPage(output, page) {
    var file = page.getFile();
    var book = output.getBook();

    var result = encodeOutput(output);
    result.page = encodePage(page, book.getSummary());
    result.file = encodeFile(file);

    return result;
}

module.exports = encodeOutputWithPage;
