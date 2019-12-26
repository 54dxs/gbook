var PluginDependency = require('../../models/pluginDependency');
var hasPlugin = require('./hasPlugin');
var isDefaultPlugin = require('./isDefaultPlugin');

/**
 * 启用/禁用一个插件
 *
 * @param {Config} config 配置文件对象
 * @param {String} pluginName 插件名称
 * @param {Boolean} state (optional) 插件状态(true:开启;false:关闭)
 * @return {Config}
 */
function togglePlugin(config, pluginName, state) {
    var deps = config.getPluginDependencies();

    // 对于默认插件，我们应该确保它首先列出
    if (isDefaultPlugin(pluginName) && !hasPlugin(deps, pluginName)) {
        deps = deps.push(PluginDependency.create(pluginName));
    }

    deps = deps.map(function(dep) {
        if (dep.getName() === pluginName) {
            return dep.toggle(state);
        }

        return dep;
    });

    return config.setPluginDependencies(deps);
}

module.exports = togglePlugin;
