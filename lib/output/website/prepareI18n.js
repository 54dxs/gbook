var path = require('path');

var fs = require('../../utils/fs');
var Promise = require('../../utils/promise');
var listSearchPaths = require('./listSearchPaths');

/**
 * 准备i18n，从插件和book加载翻译
 *
 * @param {Output} output
 * @return {Promise<Output>}
 */
function prepareI18n(output) {
    var state = output.getState();
    var i18n = state.getI18n();
    var searchPaths = listSearchPaths(output);

    searchPaths
        .reverse()
        .forEach(function(searchPath) {
            var i18nRoot = path.resolve(searchPath, '_i18n');

            if (!fs.existsSync(i18nRoot)) return;
            i18n.load(i18nRoot);
        });

    return Promise(output);
}

module.exports = prepareI18n;
