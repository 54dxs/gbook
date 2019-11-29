var DEFAULT_PLUGINS = require('../../constants/defaultPlugins');
var hasPlugin = require('./hasPlugin');

/**
 * 插件是否是默认插件
 *
 * @param {String} pluginName 插件名称
 * @param {String} version 插件版本号
 * @return {Boolean} true:是默认插件;false:不是默认插件
 */
function isDefaultPlugin(pluginName, version) {
    return hasPlugin(DEFAULT_PLUGINS, pluginName, version);
}

module.exports = isDefaultPlugin;
