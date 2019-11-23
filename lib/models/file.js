var path = require('path');
var Immutable = require('immutable');

var parsers = require('../parsers');

var File = Immutable.Record({
    // 文件的路径，相对于FS
    path:       String(),

    // 上次修改文件数据的时间
    mtime:      Date()
});

File.prototype.getPath = function() {
    return this.get('path');
};

File.prototype.getMTime = function() {
    return this.get('mtime');
};

/**
 * 文件是否存在/是设置的
 * @return {Boolean}
 */
File.prototype.exists = function() {
    return Boolean(this.getPath());
};

/**
 * 返回文件类型 ('markdown' or 'asciidoc')
 * @return {String}
 */
File.prototype.getType = function() {
    var parser = this.getParser();
    if (parser) {
        return parser.getName();
    } else {
        return undefined;
    }
};

/**
 * 获取文件的扩展名(小写)
 * @return {String}
 */
File.prototype.getExtension = function() {
    return path.extname(this.getPath()).toLowerCase();
};

/**
 * 返回此文件的分析器
 * @return {Parser}
 */
File.prototype.getParser = function() {
    return parsers.getByExt(this.getExtension());
};

/**
 * 根据stat信息创建文件
 * @param {String} filepath
 * @param {Object|fs.Stats} stat
 * @return {File}
 */
File.createFromStat = function createFromStat(filepath, stat) {
    return new File({
        path: filepath,
        mtime: stat.mtime
    });
};

/**
 * 创建一个只有路径的文件
 * @param {String} filepath
 * @return {File}
 */
File.createWithFilepath = function createWithFilepath(filepath) {
    return new File({
        path: filepath
    });
};

module.exports = File;
