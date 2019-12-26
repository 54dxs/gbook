var path = require('path');
var nunjucks = require('nunjucks');
var DoExtension = require('nunjucks-do')(nunjucks);

var Api = require('../../api');
var deprecate = require('../../api/deprecate');
var JSONUtils = require('../../json');
var LocationUtils = require('../../utils/location');
var fs = require('../../utils/fs');
var PathUtils = require('../../utils/path');
var TemplateEngine = require('../../models/templateEngine');
var templatesFolder = require('../../constants/templatesFolder');
var defaultFilters = require('../../constants/defaultFilters');
var Templating = require('../../templating');
var listSearchPaths = require('./listSearchPaths');

var fileToURL = require('../helper/fileToURL');
var resolveFileToURL = require('../helper/resolveFileToURL');

/**
 * 包含模板的主题的目录
 */
function templateFolder(dir) {
    return path.join(dir, templatesFolder);
}

/**
 * 创建模板引擎以呈现主题
 *
 * @param {Output} output
 * @param {String} currentFile
 * @return {TemplateEngine}
 */
function createTemplateEngine(output, currentFile) {
    var book = output.getBook();
    var state = output.getState();
    var i18n = state.getI18n();
    var config = book.getConfig();
    var summary = book.getSummary();
    var outputFolder = output.getRoot();

    // 搜索模板路径
    var searchPaths = listSearchPaths(output);
    /* tplSearchPaths---> List {
      size: 8,
      _origin: 0,
      _capacity: 8,
      _level: 5,
      _root: null,
      _tail: VNode {
        array: [
          'D:\\GitHub\\node\\testbook\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-livereload\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-highlight\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-search\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-lunr\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-sharing\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-fontsettings\\_layouts',
          'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-theme-default\\_layouts'
        ],
        ownerID: undefined
      },
      __ownerID: undefined,
      __hash: undefined,
      __altered: false
    } */
    var tplSearchPaths = searchPaths.map(templateFolder);

    // 创建加载程序
    var loader = new Templating.ThemesLoader(tplSearchPaths);

    // Get languages
    var language = config.getValue('language');

    // Create API context
    var context = Api.encodeGlobal(output);


    /**
     * 检查文件是否存在
     * @param {String} fileName
     * @return {Boolean}
     */
    function fileExists(fileName) {
        if (!fileName) {
            return false;
        }

        var filePath = PathUtils.resolveInRoot(outputFolder, fileName);
        return fs.existsSync(filePath);
    }

    /**
     * 按路径返回文章
     * @param {String} filePath
     * @return {Object|undefined}
     */
    function getArticleByPath(filePath) {
        var article = summary.getByPath(filePath);
        if (!article) return undefined;

        return JSONUtils.encodeSummaryArticle(article);
    }

    /**
     * 按路径返回页
     * @param {String} filePath
     * @return {Object|undefined}
     */
    function getPageByPath(filePath) {
        var page = output.getPage(filePath);
        if (!page) return undefined;

        return JSONUtils.encodePage(page, summary);
    }

    return TemplateEngine.create({
        loader: loader,

        context: context,

        globals: {
            getArticleByPath: getArticleByPath,
            getPageByPath: getPageByPath,
            fileExists: fileExists
        },

        filters: defaultFilters.merge({
            /**
             * 翻译句子
             */
            t: function t(s) {
                return i18n.t(language, s);
            },

            /**
             * 将绝对文件路径解析为
             * 相对路径。
             * 它还可以解析页面
             */
            resolveFile: function(filePath) {
                filePath = resolveFileToURL(output, filePath);
                return LocationUtils.relativeForFile(currentFile, filePath);
            },

            resolveAsset: function(filePath) {
                filePath = LocationUtils.toAbsolute(filePath, '', '');
                filePath = path.join('gitbook', filePath);
                filePath = LocationUtils.relativeForFile(currentFile, filePath);

                // Use assets from parent if language book
                if (book.isLanguageBook()) {
                    filePath = path.join('../', filePath);
                }

                return LocationUtils.normalize(filePath);
            },


            fileExists: deprecate.method(book, 'fileExists', fileExists, 'Filter "fileExists" is deprecated, use "fileExists(filename)" '),
            getArticleByPath: deprecate.method(book, 'getArticleByPath', fileExists, 'Filter "getArticleByPath" is deprecated, use "getArticleByPath(filename)" '),

            contentURL: function(filePath) {
                return fileToURL(output, filePath);
            }
        }),

        extensions: {
            'DoExtension': new DoExtension()
        }
    });
}

module.exports = createTemplateEngine;
