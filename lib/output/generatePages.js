var Promise = require('../utils/promise');
var generatePage = require('./generatePage');

/**
    使用生成器输出所有页面

    @param {Generator} generator
    @param {Output} output
    @return {Promise<Output>}
*/
function generatePages(generator, output) {
    var pages = output.getPages();
    var logger = output.getLogger();

    if (!generator.onPage) {
        return Promise(output);
    }

    return Promise.reduce(pages, function(out, page) {
        var file = page.getFile();

        logger.debug.ln('generate page "' + file.getPath() + '"');

        return generatePage(out, page)
        .then(function(resultPage) {
            return generator.onPage(out, resultPage);
        })
        .fail(function(err) {
            logger.error.ln('生成页时出错 "' + file.getPath() + '":');
            throw err;
        });
    }, output);
}

module.exports = generatePages;
