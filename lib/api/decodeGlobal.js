var decodeConfig = require('./decodeConfig');

/**
    解码从JS API到输出对象的更改。
    只有配置可以被插件的钩子编辑

    @param {Output} output
    @param {Object} result: result from API
    @return {Output}
*/
function decodeGlobal(output, result) {
    var book = output.getBook();
    var config = book.getConfig();

    // Update config
    config = decodeConfig(config, result.config);
    book = book.set('config', config);

    return output.set('book', book);
}

module.exports = decodeGlobal;
