var DEFAULT_PLUGINS = require('../constants/defaultPlugins');
var sortDependencies = require('./sortDependencies');

/**
 * 列出book中的所有依赖项，包括默认插件。
 * 它返回一个带有默认插件的concat并删除禁用的插件。
 *
 * @param {List<PluginDependency>} deps
 * @return {List<PluginDependency>}
 */
function listDependencies(deps) {
    // Extract list of plugins to disable (starting with -)
    // 提取要禁用的插件列表（以-开头）
    var toRemove = deps
        .filter(function(plugin) {
            return !plugin.isEnabled();
        })
        .map(function(plugin) {
            return plugin.getName();
        });

    // 拼接默认插件,组成插件集
    deps = deps.concat(DEFAULT_PLUGINS);

    // 移除要禁用的插件集
    deps = deps.filterNot(function(plugin) {
        return toRemove.includes(plugin.getName());
    });

    // 将插件排序
    return sortDependencies(deps);
}

module.exports = listDependencies;
