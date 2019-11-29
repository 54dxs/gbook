/**
 * 校验插件是否在列表中
 *
 * @param {{List<PluginDependency}} deps 插件列表
 * @param {String} pluginName 插件名
 * @param {String} version 插件版本号
 * @return {Boolean} true:在列表中;false:不在列表中
 */
function hasPlugin(deps, pluginName, version) {
    return !!deps.find(function(dep) {
        return dep.getName() === pluginName && (!version || dep.getVersion() === version);
    });
}

module.exports = hasPlugin;
