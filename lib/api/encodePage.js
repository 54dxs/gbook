var JSONUtils = require('../json');
var deprecate = require('./deprecate');
var encodeProgress = require('./encodeProgress');

/**
    在一个上下文中编码一页到一个JS API

    @param {Output} output
    @param {Page} page
    @return {Object}
*/
function encodePage(output, page) {
    var book = output.getBook();
    var summary = book.getSummary();
    var fs = book.getContentFS();
    var file = page.getFile();

    // JS页面基于JSON输出
    var result = JSONUtils.encodePage(page, summary);

    result.type = file.getType();
    result.path = file.getPath();
    result.rawPath = fs.resolve(result.path);

    deprecate.field(output, 'page.progress', result, 'progress', function() {
        return encodeProgress(output, page);
    }, '"page.progress" property is deprecated');

    deprecate.field(output, 'page.sections', result, 'sections', [
        {
            content: result.content,
            type: 'normal'
        }
    ], '"sections" property is deprecated, use page.content instead');

    return result;
}

module.exports = encodePage;
