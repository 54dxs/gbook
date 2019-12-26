
/**
    返回文件的JSON表示形式
    1,文件路径
    2,文件生成时间
    3,文件类型

    @param {File} file
    @return {Object}
*/
function encodeFileToJson(file) {
    var filePath = file.getPath();
    if (!filePath) {
        return undefined;
    }

    return {
        path: filePath,
        mtime: file.getMTime(),
        type: file.getType()
    };
}

module.exports = encodeFileToJson;
