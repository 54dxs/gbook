var Promise = require('../utils/promise');

/**
    使用生成器输出所有assets

    @param {Generator} generator
    @param {Output} output
    @return {Promise<Output>}
*/
function generateAssets(generator, output) {
    var assets = output.getAssets();
    var logger = output.getLogger();

    // generator是否忽略assets?
    if (!generator.onAsset) {
        return Promise(output);
    }

    return Promise.reduce(assets, function(out, assetFile) {
        logger.debug.ln('拷贝资产文件 "' + assetFile + '"');

        return generator.onAsset(out, assetFile);
    }, output);
}

module.exports = generateAssets;
