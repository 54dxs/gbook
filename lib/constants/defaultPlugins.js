var Immutable = require('immutable');
var PluginDependency = require('../models/pluginDependency');

var pkg = require('../../package.json');

/**
 * 从gbook的依赖项创建一个PluginDependency,从package.json中读取插件的版本号
 *
 * @param {String} pluginName 插件名称(不包括前缀gbook-plugin-)
 * @return {PluginDependency}
 */
function createFromDependency(pluginName) {
    var npmID = PluginDependency.nameToNpmID(pluginName);
    var version = pkg.dependencies[npmID];

    return PluginDependency.create(pluginName, version);
}

/**
 * book的默认插件列表,
 * 默认插件需要在gbook的package.json配置依赖
 */
module.exports = Immutable.List([
    'highlight',
    'search',
    'lunr',
    'sharing',
    'fontsettings',
    'theme-default'
]).map(createFromDependency);
