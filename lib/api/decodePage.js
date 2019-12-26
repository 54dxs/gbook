var deprecate = require('./deprecate');

/**
    解码从JS API到page对象的更改。
    只有内容可以被插件的钩子编辑。

    @param {Output} output
    @param {Page} page: page instance to edit
    @param {Object} result: result from API
    @return {Page}
*/
function decodePage(output, page, result) {
    var originalContent = page.getContent();

    // 无返回值
    // 现有的内容将被使用
    if (!result) {
        return page;
    }

    deprecate.disable('page.sections');

    // GBook 3
    // 如果与原始内容不同，则使用返回的page.content
    if (result.content != originalContent) {
        page = page.set('content', result.content);
    }

    // GBook 2 兼容性
    // 最后, 使用 page.sections
    else if (result.sections) {
        page = page.set('content',
            result.sections.map(function(section) {
                return section.content;
            }).join('\n')
        );
    }

    deprecate.enable('page.sections');

    return page;
}

module.exports = decodePage;
