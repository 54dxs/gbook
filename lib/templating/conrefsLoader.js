var path = require('path');
var nunjucks = require('nunjucks');

var fs = require('../utils/fs');
var Git = require('../utils/git');
var LocationUtils = require('../utils/location');
var PathUtils = require('../utils/path');


/**
 * 模板加载程序解决这两个问题：
 *      - relative url ("./test.md")
 *      - absolute url ("/test.md")
 *      - git url ("")
 *
 * @param {String} rootFolder
 * @param {Function(filePath, source)} transformFn (optional)
 * @param {Logger} logger (optional)
 */
var ConrefsLoader = nunjucks.Loader.extend({
    async: true,

    init: function(rootFolder, transformFn, logger) {
        this.rootFolder = rootFolder;
        this.transformFn = transformFn;
        this.logger = logger;
        this.git = new Git();
    },

    getSource: function(sourceURL, callback) {
        var that = this;

        this.git.resolve(sourceURL)
        .then(function(filepath) {
            // 是本地文件
            if (!filepath) {
                filepath = path.resolve(sourceURL);
            } else {
                if (that.logger) that.logger.debug.ln('resolve from git', sourceURL, 'to', filepath);
            }

            // 从绝对路径读取文件
            return fs.readFile(filepath)
            .then(function(source) {
                source = source.toString('utf8');

                if (that.transformFn) {
                    return that.transformFn(filepath, source);
                }

                return source;
            })
            .then(function(source) {
                return {
                    src: source,
                    path: filepath
                };
            });
        })
        .nodeify(callback);
    },

    resolve: function(from, to) {
        // 如果origin在book中，我们强制结果文件在book中
        if (PathUtils.isInRoot(this.rootFolder, from)) {

            // 根文件夹中当前模板的路径（不是fs的绝对路径）
            var fromRelative = path.relative(this.rootFolder, from);

            // 将“to”解析为相对于根文件夹的文件路径
            var href = LocationUtils.toAbsolute(to, path.dirname(fromRelative), '');

            // 返回绝对路径
            return PathUtils.resolveInRoot(this.rootFolder, href);
        }

        // 如果源代码在git存储库中，我们将解析git存储库中的文件
        var gitRoot = this.git.resolveRoot(from);
        if (gitRoot) {
            return PathUtils.resolveInRoot(gitRoot, to);
        }

        // 如果来源不在book中（包括来自git content ref的内容）
        return path.resolve(path.dirname(from), to);
    },

    // 将所有文件作为相对文件处理，以便nunjucks将责任传递给'resolve'
    isRelative: function(filename) {
        return LocationUtils.isRelative(filename);
    }
});

module.exports = ConrefsLoader;
