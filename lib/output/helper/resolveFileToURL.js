var LocationUtils = require('../../utils/location');

var fileToURL = require('./fileToURL');

/**
 * 解析绝对路径（从链接中提取）
 *
 * @param {Output} output
 * @param {String} filePath
 * @return {String}
 */
function resolveFileToURL(output, filePath) {
    // 转换 /test.png -> test.png
    filePath = LocationUtils.toAbsolute(filePath, '', '');

    var page = output.getPage(filePath);

    // 如果文件是页面，则返回正确的.html url
    if (page) {
        filePath = fileToURL(output, filePath);
    }

    return LocationUtils.normalize(filePath);
}

module.exports = resolveFileToURL;
