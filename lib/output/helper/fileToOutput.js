var path = require('path');

var PathUtils = require('../../utils/path');
var LocationUtils = require('../../utils/location');

var OUTPUT_EXTENSION = '.html';

/**
 * 将文件路径（绝对）转换为用于输出的文件名
 *
 * @param {Output} output
 * @param {String} filePath
 * @return {String}
 *  README.md -> index.html
 *  doc/README1.md -> doc/README1.html
 */
function fileToOutput(output, filePath) {
    var book = output.getBook();
    var readme = book.getReadme();
    var fileReadme = readme.getFile();

    if (
        path.basename(filePath, path.extname(filePath)) == 'README' ||
        (fileReadme.exists() && filePath == fileReadme.getPath())
    ) {
        filePath = path.join(path.dirname(filePath), 'index' + OUTPUT_EXTENSION);
    } else {
        filePath = PathUtils.setExtension(filePath, OUTPUT_EXTENSION);
    }

    return LocationUtils.normalize(filePath);
}

module.exports = fileToOutput;
