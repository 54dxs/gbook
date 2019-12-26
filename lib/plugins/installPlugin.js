var npmi = require('npmi');

var Promise = require('../utils/promise');
var resolveVersion = require('./resolveVersion');

/**
    为book安装插件

    @param {Book} book
    @param {PluginDependency} plugin
    @return {Promise}
*/
function installPlugin(book, plugin) {
    var logger = book.getLogger();

    var installFolder = book.getRoot();
    var name = plugin.getName();
    var requirement = plugin.getVersion();

    logger.info.ln('');
    logger.info.ln('开始安装插件 "' + name + '"');

    // 查找要安装的版本
    return resolveVersion(plugin)
    .then(function(version) {
        if (!version) {
            throw new Error('找不到符合要求的插件 "' + name + '" 要求为 "' + requirement + '"');
        }

        logger.info.ln('从NPM安装插件 "' + name +'" (' + requirement + ') 版本为', version);
        return Promise.nfcall(npmi, {
            'name': plugin.getNpmID(),
            'version': version,
            'path': installFolder,
            'npmLoad': {
                'loglevel': 'silent',
                'loaded': true,
                'prefix': installFolder
            }
        });
    })
    .then(function() {
        logger.info.ok('插件 "' + name + '" 安装成功');
    });
}

module.exports = installPlugin;
