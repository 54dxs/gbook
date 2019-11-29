var Promise = require('../../utils/promise');

var copyPluginAssets = require('./copyPluginAssets');
var prepareI18n = require('./prepareI18n');
var prepareResources = require('./prepareResources');

/**
 * 初始化generator
 *
 * @param {Output} output
 * @return {Output}
 */
function onInit(output) {
    return Promise(output)
    .then(prepareI18n)
    .then(prepareResources)
    .then(copyPluginAssets);
}

module.exports = onInit;
