var gbook = require('../gbook');

var Promise = require('../utils/promise');

/**
    验证插件

    @param {Plugin} plugin
    @return {Promise<Plugin>}
*/
function validatePlugin(plugin) {
    var packageInfos = plugin.getPackage();

    var isValid = (
        plugin.isLoaded() &&
        packageInfos &&
        packageInfos.get('name') &&
        packageInfos.get('engines') &&
        packageInfos.get('engines').get('gbook')
    );

    if (!isValid) {
        return Promise.reject(new Error('Error 加载插件 "' + plugin.getName() + '" 在路径 "' + plugin.getPath() + '"'));
    }

    var engine = packageInfos.get('engines').get('gbook');
    if (!gbook.satisfies(engine)) {
        return Promise.reject(new Error('GBook版本不满足此插件的要求: ' + engine));
    }

    return Promise(plugin);
}

module.exports = validatePlugin;
