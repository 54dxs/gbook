var path = require('path');
var LocationUtils = require('../../utils/location');

var fileToOutput = require('./fileToOutput');

/**
    将文件路径（绝对）转换为url（不带hostname）。
    它返回一个绝对路径。

    "README.md" -> "/"
    "test/hello.md" -> "test/hello.html"
    "test/README.md" -> "test/"

    @param {Output} output
    @param {String} filePath
    @return {String}
*/
function fileToURL(output, filePath) {
    var options = output.getOptions();
    var directoryIndex = options.get('directoryIndex');

    filePath = fileToOutput(output, filePath);

    if (directoryIndex && path.basename(filePath) == 'index.html') {
        filePath = path.dirname(filePath) + '/';
    }

    return LocationUtils.normalize(filePath);
}

module.exports = fileToURL;
