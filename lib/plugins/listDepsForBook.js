var listDependencies = require('./listDependencies');

/**
 * 列出一本书的所有插件要求。
 * 它可以不同于最终的插件列表，
 * 因为插件可以有自己的依赖关系
 *
 * 1,带-开头的默认插件表示禁用,将会移除
 * 2,theme-开头的插件是一个主题插件,将排序到集合最后)
 *
 * @param {Book} book
 * @return {List<PluginDependency>}
 */
function listDepsForBook(book) {
    var config = book.getConfig();
    var plugins = config.getPluginDependencies();

    return listDependencies(plugins);
}

module.exports = listDepsForBook;
