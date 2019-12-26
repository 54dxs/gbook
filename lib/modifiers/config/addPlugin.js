var PluginDependency = require('../../models/pluginDependency');
var togglePlugin = require('./togglePlugin');
var isDefaultPlugin = require('./isDefaultPlugin');

/**
 * 添加一个插件到book的配置文件中
 *
 * @param {Config} config 配置文件对象
 * @param {String} pluginName 插件名称
 * @param {String} version (optional) 插件版本(可选)
 * @return {Config}
 */
function addPlugin(config, pluginName, version) {
    // 对于默认插件，我们只确保它是启用的
    if (isDefaultPlugin(pluginName, version)) {
        return togglePlugin(config, pluginName, true);
    }

    var deps = config.getPluginDependencies();
    var dep = PluginDependency.create(pluginName, version);

    deps = deps.push(dep);
    return config.setPluginDependencies(deps);
}

module.exports = addPlugin;
