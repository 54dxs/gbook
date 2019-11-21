var path = require('path');
var error = require('./error');

/**
 * 规范化文件名
 * @param {Object} filename
 */
function normalizePath(filename) {
    return path.normalize(filename);
}

/**
 * 如果文件路径在文件夹中，则返回true
 * @param {Object} root
 * @param {Object} filename
 */
function isInRoot(root, filename) {
    root = path.normalize(root);
    filename = path.normalize(filename);

    if (root === '.') {
        return true;
    }
    if (root[root.length - 1] != path.sep) {
        root = root + path.sep;
    }

    return (filename.substr(0, root.length) === root);
}

/**
 * 解析特定文件夹中的路径
 * 如果文件在此文件夹之外，则引发错误
 * @param {Object} root
 */
function resolveInRoot(root) {
    var input, result;
    var args = Array.prototype.slice.call(arguments, 1);

    input = args
        .reduce(function(current, p) {
            // Handle path relative to book root ("/README.md")
            if (p[0] == '/' || p[0] == '\\') return p.slice(1);

            return current? path.join(current, p) : path.normalize(p);
        }, '');

    result = path.resolve(root, input);

    if (!isInRoot(root, result)) {
        throw new error.FileOutOfScopeError({
            filename: result,
            root: root
        });
    }

    return result;
}

/**
 * 更改文件扩展名
 * @param {Object} filename
 * @param {Object} ext
 */
function setExtension(filename, ext) {
    return path.join(
        path.dirname(filename),
        path.basename(filename, path.extname(filename)) + ext
    );
}

/**
 * 如果文件名是相对的，则返回true。
 * @param {String} filename
 * @return {Boolean}
 */
function isPureRelative(filename) {
    return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
}

module.exports = {
    isInRoot: isInRoot,
    resolveInRoot: resolveInRoot,
    normalize: normalizePath,
    setExtension: setExtension,
    isPureRelative: isPureRelative
};
