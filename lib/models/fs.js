var path = require('path');
var Immutable = require('immutable');
var stream = require('stream');

var File = require('./file');
var Promise = require('../utils/promise');
var error = require('../utils/error');
var PathUtil = require('../utils/path');

var FS = Immutable.Record({
    root:           String(),

    fsExists:         Function(),
    fsReadFile:       Function(),
    fsStatFile:       Function(),
    fsReadDir:        Function(),

    fsLoadObject:     null,
    fsReadAsStream:   null
});

/**
 * 返回根路径
 * @return {String}
 */
FS.prototype.getRoot = function() {
    return this.get('root');
};

/**
 * 验证文件是否在fs范围内
 * @param {String} filename
 * @return {Boolean}
 */
FS.prototype.isInScope = function(filename) {
    var rootPath = this.getRoot();
    filename = path.join(rootPath, filename);

    return PathUtil.isInRoot(rootPath, filename);
};

/**
 * 解析此FS中的文件
 * @return {String}
 */
FS.prototype.resolve = function() {
    var rootPath = this.getRoot();
    var args = Array.prototype.slice.call(arguments);
    var filename = path.join.apply(path, [rootPath].concat(args));
    filename = path.normalize(filename);

    if (!this.isInScope(filename)) {
        throw error.FileOutOfScopeError({
            filename: filename,
            root: this.root
        });
    }

    return filename;
};

/**
 * 检查文件是否存在,如果存在则运行 Promise(true),否则运行 Promise(false)
 *
 * @param {String} filename
 * @return {Promise<Boolean>}
 */
FS.prototype.exists = function(filename) {
    var that = this;

    return Promise()
    .then(function() {
        filename = that.resolve(filename);
        var exists = that.get('fsExists');

        return exists(filename);
    });
};

/**
 * 读取文件并返回内容作为缓冲区的 promise
 * @param {String} filename
 * @return {Promise<Buffer>}
 */
FS.prototype.read = function(filename) {
    var that = this;

    return Promise()
    .then(function() {
        filename = that.resolve(filename);
        var read = that.get('fsReadFile');

        return read(filename);
    });
};

/**
 * 以字符串形式读取文件 (utf-8)
 * @param {String} filename
 * @param {Object} encoding
 * @return {Promise<String>}
 */
FS.prototype.readAsString = function(filename, encoding) {
    encoding = encoding || 'utf8';

    return this.read(filename)
    .then(function(buf) {
        return buf.toString(encoding);
    });
};

/**
 * 以文件流形式读取文件
 * @param {String} filename
 * @return {Promise<Stream>}
 */
FS.prototype.readAsStream = function(filename) {
    var that = this;
    var filepath = that.resolve(filename);
    var fsReadAsStream = this.get('fsReadAsStream');

    if (fsReadAsStream) {
        return Promise(fsReadAsStream(filepath));
    }

    return this.read(filename)
    .then(function(buf) {
        var bufferStream = new stream.PassThrough();
        bufferStream.end(buf);

        return bufferStream;
    });
};

/**
 * 读取有关文件的统计信息
 * @param {String} filename
 * @return {Promise<File>}
 */
FS.prototype.statFile = function(filename) {
    var that = this;

    return Promise()
    .then(function() {
        var filepath = that.resolve(filename);
        var stat = that.get('fsStatFile');

        return stat(filepath);
    })
    .then(function(stat) {
        return File.createFromStat(filename, stat);
    });
};

/**
 * 列出目录中的文件/目录。
 * 目录以“/”结尾
 * @param {String} dirname
 * @return {Promise<List<String>>}
 */
FS.prototype.readDir = function(dirname) {
    var that = this;

    return Promise()
    .then(function() {
        var dirpath = that.resolve(dirname);
        var readDir = that.get('fsReadDir');

        return readDir(dirpath);
    })
    .then(function(files) {
        return Immutable.List(files);
    });
};

/**
 * 只列出目录中的文件
 * 目录以“/”结尾
 * @param {String} dirname
 * @return {Promise<List<String>>}
 */
FS.prototype.listFiles = function(dirname) {
    return this.readDir(dirname)
    .then(function(files) {
        return files.filterNot(pathIsFolder);
    });
};

/**
 * 列出目录中的所有文件
 * @param {String} dirName
 * @param {Function(dirName)} filterFn 为每个文件/目录调用它来测试它是否应该停止迭代
 * @return {Promise<List<String>>}
 */
FS.prototype.listAllFiles = function(dirName, filterFn) {
    var that = this;
    dirName = dirName || '.';

    return this.readDir(dirName)
    .then(function(files) {
        return Promise.reduce(files, function(out, file) {
            var isDirectory = pathIsFolder(file);
            var newDirName = path.join(dirName, file);

            if (filterFn && filterFn(newDirName) === false) {
                return out;
            }

            if (!isDirectory) {
                return out.push(newDirName);
            }

            return that.listAllFiles(newDirName, filterFn)
            .then(function(inner) {
                return out.concat(inner);
            });
        }, Immutable.List());
    });
};

/**
 * 在文件夹中查找文件（不区分大小写）
 * 返回找到的文件名
 * @param {String} dirname
 * @param {String} filename
 * @return {Promise<String>}
 */
FS.prototype.findFile = function(dirname, filename) {
    return this.listFiles(dirname)
    .then(function(files) {
        return files.find(function(file) {
            return (file.toLowerCase() == filename.toLowerCase());
        });
    });
};

/**
 * 加载一个JSON文件
 * 默认情况下,fs只支持JSON
 * @param {String} filename
 * @return {Promise<Object>}
 */
FS.prototype.loadAsObject = function(filename) {
    var that = this;
    var fsLoadObject = this.get('fsLoadObject');

    return this.exists(filename)
    .then(function(exists) {
        if (!exists) {
            var err = new Error('Module doesn\'t exist');
            err.code = 'MODULE_NOT_FOUND';

            throw err;
        }

        if (fsLoadObject) {
            return fsLoadObject(that.resolve(filename));
        } else {
            return that.readAsString(filename)
            .then(function(str) {
                return JSON.parse(str);
            });
        }
    });
};

/**
 * 创建一个FS实例
 * @param {Object} def
 * @return {FS}
 */
FS.create = function create(def) {
    return new FS(def);
};

/**
 * 创建范围缩小的新FS实例
 * @param {FS} fs
 * @param {String} scope
 * @return {FS}
 */
FS.reduceScope = function reduceScope(fs, scope) {
    return fs.set('root', path.join(fs.getRoot(), scope));
};


/**
 * .readdir将文件/文件夹作为字符串列表返回，文件夹以“/”结尾
 * @param {Object} filename
 */
function pathIsFolder(filename) {
    var lastChar = filename[filename.length - 1];
    return lastChar == '/' || lastChar == '\\';
}

module.exports = FS;
