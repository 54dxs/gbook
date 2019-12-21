var Templating = require('../templating');
var TemplateEngine = require('../models/templateEngine');

var Api = require('../api');
var Plugins = require('../plugins');

var defaultBlocks = require('../constants/defaultBlocks');
var defaultFilters = require('../constants/defaultFilters');

/**
    为输出创建模板引擎。
    它添加默认的filters/blocks，然后添加来自插件的filters/blocks

    @param {Output} output
    @return {TemplateEngine}
*/
function createTemplateEngine(output) {
    var plugins = output.getPlugins();
    var book = output.getBook();
    var rootFolder = book.getContentRoot();// D:\GitHub\node\testbook
    var logger = book.getLogger();

    var filters = Plugins.listFilters(plugins);
    var blocks = Plugins.listBlocks(plugins);

    // 默认扩展
    blocks = defaultBlocks.merge(blocks);
    filters = defaultFilters.merge(filters);

    // 创建加载程序
    var transformFn = Templating.replaceShortcuts.bind(null, blocks);
    var loader = new Templating.ConrefsLoader(rootFolder, transformFn, logger);

    // 创建API上下文
    var context = Api.encodeGlobal(output);

    return new TemplateEngine({
        filters:    filters,
        blocks:     blocks,
        loader:     loader,
        context:    context
    });
}

module.exports = createTemplateEngine;
