var npmi = require('npmi');

var DEFAULT_PLUGINS = require('../constants/defaultPlugins');
var Promise = require('../utils/promise');
var installPlugin = require('./installPlugin');

/**
    给book安装一个插件的要求

    @param {Book} book
    @return {Promise<Number>}
*/
function installPlugins(book) {
    var logger = book.getLogger();
    var config = book.getConfig();
    var plugins = config.getPluginDependencies();

    // 删除默认插件
    //（仅当版本与安装的版本相同时）
    plugins = plugins.filterNot(function(plugin) {
        var dependency = DEFAULT_PLUGINS.find(function(dep) {
            return dep.getName() === plugin.getName();
        });

        return (
            // 禁用的插件
            !plugin.isEnabled() ||

            // 或者默认安装在GBook中
            (dependency &&
            plugin.getVersion() === dependency.getVersion())
        );
    });

    if (plugins.size == 0) {
        logger.info.ln('无需安装!');
        return Promise();
    }

    logger.info.ln('installing', plugins.size, 'plugins using npm@' + npmi.NPM_VERSION);

    return Promise.forEach(plugins, function(plugin) {
        return installPlugin(book, plugin);
    })
    .thenResolve(plugins.size);
}

module.exports = installPlugins;
