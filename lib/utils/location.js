var url = require('url');
var path = require('path');

/**
 * 判断url是外部url吗
 *
 * @param {Object} href
 */
function isExternal(href) {
    try {
        return Boolean(url.parse(href).protocol) && !isDataURI(href);
    } catch(err) {
        return false;
    }
}

/**
 * url是内嵌 data-uri 吗
 * @param {Object} href
 */
function isDataURI(href) {
    try {
        return Boolean(url.parse(href).protocol) && (url.parse(href).protocol === 'data:');
    } catch(err) {
        return false;
    }
}

/**
 * 反转 isExternal()
 * @param {Object} href
 */
function isRelative(href) {
    return !isExternal(href);
}

/**
 * 如果链接是achor，则返回true
 * @param {Object} href
 */
function isAnchor(href) {
    try {
        var parsed = url.parse(href);
        return !!(!parsed.protocol && !parsed.path && parsed.hash);
    } catch(err) {
        return false;
    }
}

/**
 * 将路径规范化为链接
 * @param {Object} s
 */
function normalize(s) {
    return path.normalize(s).replace(/\\/g, '/');
}

/**
 * 展平路径，删除前导"/"
 *
 * @param {String} href
 * @return {String}
 */
function flatten(href) {
    href = normalize(href);
    if (href[0] == '/') {
        href = normalize(href.slice(1));
    }

    return href;
}

/**
 * 将相对路径转换为绝对路径
 *
 * @param {String} href
 * @param {String} dir: 当前正在呈现的文件的目录父级
 * @param {String} outdir: html输出中的目录父级
 * @return {String}
 */
function toAbsolute(_href, dir, outdir) {
    if (isExternal(_href) || isDataURI(_href)) {
        return _href;
    }

    outdir = outdir == undefined? dir : outdir;

    _href = normalize(_href);
    dir = normalize(dir);
    outdir = normalize(outdir);

    // 基本文件夹中的路径 "_href"
    var hrefInRoot = normalize(path.join(dir, _href));
    if (_href[0] == '/') {
        hrefInRoot = normalize(_href.slice(1));
    }

    // 使其相对于输出
    _href = path.relative(outdir, hrefInRoot);

    // 规范化windows路径
    _href = normalize(_href);

    return _href;
}

/**
 * 将特定文件夹（dir）的绝对路径转换为相对路径
 * ('test/', 'hello.md') -> '../hello.md'
 *
 * @param {String} dir: 当前目录
 * @param {String} file: 文件的绝对路径
 * @return {String}
 */
function relative(dir, file) {
    var isDirectory = file.slice(-1) === '/';
    return normalize(path.relative(dir, file)) + (isDirectory? '/': '');
}

/**
 * 将特定文件夹（dir）的绝对路径转换为相对路径
 * ('test/test.md', 'hello.md') -> '../hello.md'
 *
 * @param {String} baseFile: 当前文件
 * @param {String} file: 文件的绝对路径
 * @return {String}
 */
function relativeForFile(baseFile, file) {
    return relative(path.dirname(baseFile), file);
}

/**
 * 比较两条路径，如果它们相同，则返回true
 * ('README.md', './README.md') -> true
 *
 * @param {String} p1: first path
 * @param {String} p2: second path
 * @return {Boolean}
 */
function areIdenticalPaths(p1, p2) {
    return normalize(p1) === normalize(p2);
}

module.exports = {
    areIdenticalPaths: areIdenticalPaths,
    isDataURI:         isDataURI,
    isExternal:        isExternal,
    isRelative:        isRelative,
    isAnchor:          isAnchor,
    normalize:         normalize,
    toAbsolute:        toAbsolute,
    relative:          relative,
    relativeForFile:   relativeForFile,
    flatten:           flatten
};
