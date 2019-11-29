var Immutable = require('immutable');

/**
    从插件列表中列出Blocks

    @param {OrderedMap<String:Plugin>}
    @return {Map<String:TemplateBlock>}
*/
function listBlocks(plugins) {
    return plugins
        .reverse()
        .reduce(function(result, plugin) {
            var blocks = plugin.getBlocks();
            return result.merge(blocks);
        }, Immutable.Map());
}

module.exports = listBlocks;
