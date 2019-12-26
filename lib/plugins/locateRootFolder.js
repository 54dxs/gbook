var path = require('path');
var resolve = require('resolve');

var DEFAULT_PLUGINS = require('../constants/defaultPlugins');

/**
 * 解析包含 node_modules 的根文件夹
 * 因为gbook可以用作一个库，并且依赖关系可以放平。
 *
 * @return {String} folderPath
 */
function locateRootFolder() {
    var firstDefaultPlugin = DEFAULT_PLUGINS.first();// 第一个默认插件
    // pluginPath = D:\GitHub\node\gbook\node_modules\gitbook-plugin-highlight\package.json
    var pluginPath = resolve.sync(firstDefaultPlugin.getNpmID() + '/package.json', {
        basedir: __dirname
    });
    // nodeModules = D:\GitHub\node\gbook
    var nodeModules = path.resolve(pluginPath, '../../..');
    return nodeModules;
}

module.exports = locateRootFolder;
