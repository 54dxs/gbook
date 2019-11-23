var fs = require('graceful-fs');// 原生fs的替代模块,做了一些增强
var mkdirp = require('mkdirp');// 递归创建目录及其子目录
var destroy = require('destroy');// 数据流用后销毁
var rmdir = require('rmdir');
var tmp = require('tmp');
var request = require('request');
var path = require('path');
var cp = require('cp');
var cpr = require('cpr');

var Promise = require('./promise');

/**
 * 将流写入文件
 * @param {Object} filename
 * @param {Object} st
 */
function writeStream(filename, st) {
    var d = Promise.defer();

    var wstream = fs.createWriteStream(filename);
    var cleanup = function() {
        destroy(wstream);
        wstream.removeAllListeners();
    };

    wstream.on('finish', function () {
        cleanup();
        d.resolve();
    });
    wstream.on('error', function (err) {
        cleanup();
        d.reject(err);
    });

    st.on('error', function(err) {
        cleanup();
        d.reject(err);
    });

    st.pipe(wstream);

    return d.promise;
}

/**
 * 判断文件是否存在,返回一个promise
 * @param {Object} filename
 */
function fileExists(filename) {
    var d = Promise.defer();

    fs.exists(filename, function(exists) {
        d.resolve(exists);
    });

    return d.promise;
}

/**
 * 生成临时文件
 * @param {Object} opts
 */
function genTmpFile(opts) {
    return Promise.nfcall(tmp.file, opts)
        .get(0);
}

/**
 * 生成临时目录
 * @param {Object} opts
 */
function genTmpDir(opts) {
    return Promise.nfcall(tmp.dir, opts)
        .get(0);
}

/**
 * 下载图片
 * @param {Object} uri
 * @param {Object} dest
 */
function download(uri, dest) {
    return writeStream(dest, request(uri));
}

/**
 * 在文件夹中查找可用的文件名
 * @param {Object} base
 * @param {Object} filename
 */
function uniqueFilename(base, filename) {
    var ext = path.extname(filename);
    filename = path.resolve(base, filename);
    filename = path.join(path.dirname(filename), path.basename(filename, ext));

    var _filename = filename+ext;

    var i = 0;
    while (fs.existsSync(filename)) {
        _filename = filename + '_' + i + ext;
        i = i + 1;
    }

    return Promise(path.relative(base, _filename));
}

/**
 * 创建一个文件(创建多级目录),保证最终文件的创建成功
 * @param {Object} filename
 */
function ensureFile(filename) {
    var base = path.dirname(filename);
    return Promise.nfcall(mkdirp, base);
}

/**
 * 删除文件夹
 * @param {Object} base
 */
function rmDir(base) {
    return Promise.nfcall(rmdir, base, {
        fs: fs
    });
}

/**
 * 断言一个文件，如果它不存在，调用“生成器”
 * @param {String} filePath
 * @param {Function} generator
 * @return {Promise}
 */
function assertFile(filePath, generator) {
    return fileExists(filePath)
    .then(function(exists) {
        if (exists) return;

        return generator();
    });
}

/**
 * 选择一个文件，如果存在，返回绝对路径，否则不定义
 * @param {String} rootFolder
 * @param {String} fileName
 * @return {String}
 */
function pickFile(rootFolder, fileName) {
    var result = path.join(rootFolder, fileName);
    if (fs.existsSync(result)) {
        return result;
    }

    return undefined;
}

/**
 * 确保目录存在并且是空的
 * @param {String} rootFolder
 * @return {Promise}
 */
function ensureFolder(rootFolder) {
    return rmDir(rootFolder)
    .fail(function() {
        return Promise();
    })
    .then(function() {
        return Promise.nfcall(mkdirp, rootFolder);
    });
}

module.exports = {
    exists: fileExists,
    existsSync: fs.existsSync,
    mkdirp: Promise.nfbind(mkdirp),
    readFile: Promise.nfbind(fs.readFile),
    writeFile: Promise.nfbind(fs.writeFile),
    assertFile: assertFile,
    pickFile: pickFile,
    stat: Promise.nfbind(fs.stat),
    statSync: fs.statSync,
    readdir: Promise.nfbind(fs.readdir),
    writeStream: writeStream,
    readStream: fs.createReadStream,
    copy: Promise.nfbind(cp),
    copyDir: Promise.nfbind(cpr),
    tmpFile: genTmpFile,
    tmpDir: genTmpDir,
    download: download,
    uniqueFilename: uniqueFilename,
    ensureFile: ensureFile,
    ensureFolder: ensureFolder,
    rmDir: rmDir
};
