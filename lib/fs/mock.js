var path = require('path');
var is = require('is');
var Buffer = require('buffer').Buffer;
var Immutable = require('immutable');// JavaScript的不可变集合

var FS = require('../models/fs');
var error = require('../utils/error');

/**
 * 创建一个假文件系统,用于 gbook 的单元测试
 * @param {Map<String:String|Map>} files
 */
function createMockFS(files) {
    files = Immutable.fromJS(files);
    var mtime = new Date();

    /**
     * 根据文件路径获取文件
     * @param {Object} filePath
     */
    function getFile(filePath) {
        // 格式化路径
        // path.normalize('C:\\temp\\\\foo\\bar\\..\\');
        // 返回: 'C:\\temp\\foo\\'
        var parts = path.normalize(filePath).split(path.sep);
        // 计算数组元素相加后的总和
        // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
        return parts.reduce(function(list, part, i) {
            if (!list) return null;

            var file;

            if (!part || part === '.') file = list;
            else file = list.get(part);

            if (!file) return null;

            if (is.string(file)) {
                if (i === (parts.length - 1)) return file;
                else return null;
            }

            return file;
        }, files);
    }

    /**
     * 判断文件路径是否存在
     * @param {Object} filePath
     */
    function fsExists(filePath) {
        return Boolean(getFile(filePath) !== null);
    }

    /**
     * 读取文件
     * @param {Object} filePath
     */
    function fsReadFile(filePath) {
        var file = getFile(filePath);
        if (!is.string(file)) {
            throw error.FileNotFoundError({
                filename: filePath
            });
        }

        return new Buffer(file, 'utf8');
    }

    /**
     * 文件创建时间
     * @param {Object} filePath
     */
    function fsStatFile(filePath) {
        var file = getFile(filePath);
        if (!file) {
            throw error.FileNotFoundError({
                filename: filePath
            });
        }

        return {
            mtime: mtime
        };
    }

    /**
     * 读取目录
     * @param {Object} filePath
     */
    function fsReadDir(filePath) {
        var dir = getFile(filePath);
        if (!dir || is.string(dir)) {
            throw error.FileNotFoundError({
                filename: filePath
            });
        }

        return dir
            .map(function(content, name) {
                if (!is.string(content)) {
                    name = name + '/';
                }

                return name;
            })
            .valueSeq();
    }

    return FS.create({
        root: '',
        fsExists: fsExists,
        fsReadFile: fsReadFile,
        fsStatFile: fsStatFile,
        fsReadDir: fsReadDir
    });
}

module.exports = createMockFS;
