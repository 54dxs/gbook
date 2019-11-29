var togglePlugin = require('./togglePlugin');
var isDefaultPlugin = require('./isDefaultPlugin');

/**
 * 从book的配置文件中移除一个插件
 *
 * @param {Config} config
 * @param {String} pluginName
 * @return {Config}
 */
function removePlugin(config, pluginName) {
    var deps = config.getPluginDependencies();

    // 对于默认插件，我们必须禁用它，而不是从列表中删除它
    if (isDefaultPlugin(pluginName)) {
        return togglePlugin(config, pluginName, false);
    }

    // 从列表中删除依赖项
    deps = deps.filterNot(function(dep) {
        return dep.getName() === pluginName;
    });
    return config.setPluginDependencies(deps);
}

module.exports = removePlugin;
