var path = require('path');
var fs = require('../../utils/fs');

/**
    将文件写入输出文件夹

    @param {Output} output
    @param {String} filePath 要生成的文件路径及文件名
    @param {Buffer|String} content 要写入文件的内容
    @return {Promise}
*/
function writeFile(output, filePath, content) {
    var rootFolder = output.getRoot();
    filePath = path.join(rootFolder, filePath);// filePath---> D:\GitHub\node\testbook\_book\index.html

    // 创建一个文件(创建多级目录),保证最终文件的创建成功
    return fs.ensureFile(filePath)
    .then(function() {
        // 向文件filePath写入内容content
        return fs.writeFile(filePath, content);
    })
    .thenResolve(output);
}

module.exports = writeFile;
