var Immutable = require('immutable');

var Promise = require('../utils/promise');
var listDepsForBook = require('./listDepsForBook');
var findForBook = require('./findForBook');
var loadPlugin = require('./loadPlugin');


/**
 * 从book中加载所有插件
 *
 * @param {Book} book
 * @return {Promise<Map<String:Plugin>}
 */
function loadForBook(book) {
    var logger = book.getLogger();

    // 列出依赖项
    var requirements = listDepsForBook(book);

    // 列出 book 中安装的所有插件
    return findForBook(book)
    .then(function(installedMap) {
        var missing = [];
        var plugins = requirements.reduce(function(result, dep) {
            var name = dep.getName();
            var installed = installedMap.get(name);

            if (installed) {
                var deps = installedMap
                    .filter(function(plugin) {
                        return plugin.getParent() === name;
                    })
                    .toArray();

                result = result.concat(deps);
                result.push(installed);
            } else {
                missing.push(name);
            }

            return result;
        }, []);

        // 将插件 list 转换为 map
        plugins = Immutable.List(plugins)
            .map(function(plugin) {
                return [
                    plugin.getName(),
                    plugin
                ];
            });
        plugins = Immutable.OrderedMap(plugins);

        // Log state
        logger.info.ln(installedMap.size + ' 个插件是安装的');
        if (requirements.size != installedMap.size) {
            logger.info.ln(requirements.size + ' explicitly listed');
        }

        // 确认所有插件都存在
        if (missing.length > 0) {
            throw new Error('本地环境没有找到插件 "' + missing.join(', ') + '", 运行 \'gbook install\' 从远程仓库安装插件到本地');
        }

        return Promise.map(plugins, function(plugin) {
            return loadPlugin(book, plugin);
        });
    });
}


module.exports = loadForBook;
