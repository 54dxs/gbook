var Plugins = require('../plugins');
var Promise = require('../utils/promise');

/**
 * 加载和设置插件
 *
 * @param {Output} output
 * @return {Promise<Output>}
 */
function preparePlugins(output) {
    var book = output.getBook();

    return Promise()

    // 只加载main book的插件
    .then(function() {
        if (book.isLanguageBook()) {
            return output.getPlugins();
        } else {
            return Plugins.loadForBook(book);
        }
    })

    // 使用插件更新book的配置
    .then(function(plugins) {
        return Plugins.validateConfig(book, plugins)
        .then(function(newBook) {
            return output.merge({
                book: newBook,
                plugins: plugins
            });
        });
    });
}

module.exports = preparePlugins;
