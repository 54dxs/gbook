var path = require('path');

var LocationUtils = require('../../utils/location');
var editHTMLElement = require('./editHTMLElement');

/**
    解析所有HTML图像:
        - /test.png in hello -> ../test.html

    @param {String} currentFile
    currentFile---> README.md
    currentFile---> doc/README1.md
    currentFile---> README2.md
    currentFile---> README3.md
    currentFile---> doc/README4.md

    @param {HTMLDom} $
*/
function resolveImages(currentFile, $) {
    // currentDirectory---> .
    // currentDirectory---> doc
    // currentDirectory---> .
    // currentDirectory---> .
    // currentDirectory---> doc
    var currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, 'img', function($img) {
        var src = $img.attr('src');

        if (LocationUtils.isExternal(src) || LocationUtils.isDataURI(src)) {
            return;
        }

        // 计算绝对路径
        src = LocationUtils.toAbsolute(src, currentDirectory, '.');

        // 转换回相对
        src = LocationUtils.relative(currentDirectory, src);

        $img.attr('src', src);
    });
}

module.exports = resolveImages;
