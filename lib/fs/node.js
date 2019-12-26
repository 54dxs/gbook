var path = require('path');
var Immutable = require('immutable');
var fresh = require('fresh-require');

var fs = require('../utils/fs');
var FS = require('../models/fs');

/**
 * 读取目录
 * @param {Object} folder
 */
function fsReadDir(folder) {
    return fs.readdir(folder)
    .then(function(files) {
        files = Immutable.List(files);

        return files
            .map(function(file) {
                if (file == '.' || file == '..') return;

                var stat = fs.statSync(path.join(folder, file));
                if (stat.isDirectory()) file = file + path.sep;
                return file;
            })
            .filter(function(file) {
                return Boolean(file);
            });
    });
}

/**
 * 根据文件名加载模块
 * @param {Object} filename
 */
function fsLoadObject(filename) {
    return fresh(filename, require);
}

module.exports = function createNodeFS(root) {
    return FS.create({
        root: root,// 跟目录D:\GitHub\node\testbook

        fsExists: fs.exists,
        fsReadFile: fs.readFile,
        fsStatFile: fs.stat,
        fsReadDir: fsReadDir,
        fsLoadObject: fsLoadObject,
        fsReadAsStream: fs.readStream
    });
};
