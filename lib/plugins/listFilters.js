var Immutable = require('immutable');

/**
    从插件列表中列出筛选器

    @param {OrderedMap<String:Plugin>}
    @return {Map<String:Function>}
*/
function listFilters(plugins) {
    return plugins
        .reverse()
        .reduce(function(result, plugin) {
            return result.merge(plugin.getFilters());
        }, Immutable.Map());
}

module.exports = listFilters;
