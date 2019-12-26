var Immutable = require('immutable');
var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');

var PathUtils = require('../utils/path');


var ThemesLoader = nunjucks.Loader.extend({
    init: function(searchPaths) {
        this.searchPaths = Immutable.List(searchPaths)
            .map(path.normalize);
    },

    /**
     * 读取解析文件的源代码
     * @param {String}
     * @return {Object}
     */
    getSource: function(fullpath) {
        if (!fullpath) return null;

        fullpath = this.resolve(null, fullpath);
        var templateName = this.getTemplateName(fullpath);

        if(!fullpath) {
            return null;
        }

        var src = fs.readFileSync(fullpath, 'utf-8');

        src = '{% do %}var template = template || {}; template.stack = template.stack || []; template.stack.push(template.self); template.self = ' + JSON.stringify(templateName) + '{% enddo %}\n' +
            src +
            '\n{% do %}template.self = template.stack.pop();{% enddo %}';

        return {
            src: src,
            path: fullpath,
            noCache: true
        };
    },

    /**
     * Nunjucks叫"isRelative"来决定何时叫"resolve"
     * 我们自己在".resolve"中处理绝对路径，所以我们总是返回true
     */
    isRelative: function() {
        return true;
    },

    /**
     * 获取包含模板的original搜索路径
     * @param {String} filepath
     * @return {String} searchPath
     */
    getSearchPath: function(filepath) {
        return this.searchPaths
            .sortBy(function(s) {
                return -s.length;
            })
            .find(function(basePath) {
                return (filepath && filepath.indexOf(basePath) === 0);
            });
    },

    /**
     * 从文件路径获取模板名称
     * @param {String} filepath
     * @return {String} name
     */
    getTemplateName: function(filepath) {
        var originalSearchPath = this.getSearchPath(filepath);
        return originalSearchPath? path.relative(originalSearchPath, filepath) : null;
    },

    /**
     * 从当前模板解析模板
     * @param {String|null} from
     * @param {String} to
     * @return {String|null}
     */
    resolve: function(from, to) {
        var searchPaths = this.searchPaths;

        // 相对模板，如 "./test.html"
        if (PathUtils.isPureRelative(to) && from) {
            return path.resolve(path.dirname(from), to);
        }

        // 确定我们当前在哪个搜索文件夹中
        var originalSearchPath = this.getSearchPath(from);
        var originalFilename = this.getTemplateName(from);

        // 如果我们包含来自不同搜索路径的相同文件
        // 分割搜索路径以避免包含以前的路径
        if (originalFilename == to) {
            var currentIndex = searchPaths.indexOf(originalSearchPath);
            searchPaths = searchPaths.slice(currentIndex + 1);
        }

        // 要在根文件夹中解析的绝对模板
        var resultFolder = searchPaths.find(function(basePath) {
            var p = path.resolve(basePath, to);

            return (
                p.indexOf(basePath) === 0
                && fs.existsSync(p)
            );
        });
        if (!resultFolder) return null;
        return path.resolve(resultFolder, to);
    }
});

module.exports = ThemesLoader;
