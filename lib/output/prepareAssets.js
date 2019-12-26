var Parse = require('../parse');

/**
 * 列出book中的所有资源文件
 *
 * @param {Output} output
 * @return {Promise<Output>}
 */
function prepareAssets(output) {
    var book = output.getBook();
    var pages = output.getPages();
    var logger = output.getLogger();

    return Parse.listAssets(book, pages)
    .then(function(assets) {
        logger.info.ln('找到', assets.size, '个资源文件');

        return output.set('assets', assets);
    });
}

module.exports = prepareAssets;
