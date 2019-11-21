var path = require('path');
var Immutable = require('immutable');

var Logger = require('../utils/logger');

var FS = require('./fs');
var Config = require('./config');
var Readme = require('./readme');
var Summary = require('./summary');
var Glossary = require('./glossary');
var Languages = require('./languages');
var Ignore = require('./ignore');

var Book = Immutable.Record({
    // 输出信息记录器
    logger:         Logger(),

    // 绑定到图书范围以读取文件/目录的文件系统
    fs:             FS(),

    // 忽略分析器文件
    ignore:         Ignore(),

    // 结构文件
    config:         Config(),
    readme:         Readme(),
    summary:        Summary(),
    glossary:       Glossary(),
    languages:      Languages(),

    // 语言书籍的语言标识
    language:       String(),

    // 子项列表（如果是多语言）(String -> Book)
    books:          Immutable.OrderedMap()
});

Book.prototype.getLogger = function() {
    return this.get('logger');
};

Book.prototype.getFS = function() {
    return this.get('fs');
};

Book.prototype.getIgnore = function() {
    return this.get('ignore');
};

Book.prototype.getConfig = function() {
    return this.get('config');
};

Book.prototype.getReadme = function() {
    return this.get('readme');
};

Book.prototype.getSummary = function() {
    return this.get('summary');
};

Book.prototype.getGlossary = function() {
    return this.get('glossary');
};

Book.prototype.getLanguages = function() {
    return this.get('languages');
};

Book.prototype.getBooks = function() {
    return this.get('books');
};

Book.prototype.getLanguage = function() {
    return this.get('language');
};

/**
 * 返回FS实例以访问内容
 * @return {FS}
 */
Book.prototype.getContentFS = function() {
    // TODO 本函数执行了4次,有待优化
    var fs = this.getFS();
    var config = this.getConfig();
    var rootFolder = config.getValue('root');

    if (rootFolder) {
        return FS.reduceScope(fs, rootFolder);
    }

    return fs;
};

/**
 * 获取root
 * @return {String}
 */
Book.prototype.getRoot = function() {
    var fs = this.getFS();
    return fs.getRoot();
};

/**
 * 获取book内容的root
 * @return {String}
 */
Book.prototype.getContentRoot = function() {
    var fs = this.getContentFS();
    return fs.getRoot();
};

/**
 * 检查文件是否被忽略（不应被解析等）
 * @param {String} filename
 * @return {Page|undefined}
 */
Book.prototype.isFileIgnored = function(filename) {
    var ignore = this.getIgnore();
    var language = this.getLanguage();

    // 忽略总是与主要boot的root有关
    if (language) {
        filename = path.join(language, filename);
    }

    return ignore.isFileIgnored(filename);
};

/**
 * 检查内容文件是否被忽略（不应被分析等）
 * @param {String} filename
 * @return {Page|undefined}
 */
Book.prototype.isContentFileIgnored = function(filename) {
    var config = this.getConfig();
    var rootFolder = config.getValue('root');

    if (rootFolder) {
        filename = path.join(rootFolder, filename);
    }

    return this.isFileIgnored(filename);
};

/**
 * 从book的路径返回一页
 * @param {Object} ref
 */
Book.prototype.getPage = function(ref) {
    return this.getPages().get(ref);
};

/**
 * 这本书是语言之父吗
 * @return {Boolean}
 */
Book.prototype.isMultilingual = function() {
    return (this.getLanguages().getCount() > 0);
};

/**
 * 如果book与语言关联，则返回true
 * @return {Boolean}
 */
Book.prototype.isLanguageBook = function() {
    return Boolean(this.getLanguage());
};

/**
    Return a languages book

    @param {String} language
    @return {Book}
*/
Book.prototype.getLanguageBook = function(language) {
    var books = this.getBooks();
    return books.get(language);
};

/**
    Add a new language book

    @param {String} language
    @param {Book} book
    @return {Book}
*/
Book.prototype.addLanguageBook = function(language, book) {
    var books = this.getBooks();
    books = books.set(language, book);

    return this.set('books', books);
};

/**
    Set the summary for this book

    @param {Summary}
    @return {Book}
*/
Book.prototype.setSummary = function(summary) {
    return this.set('summary', summary);
};

/**
    Set the readme for this book

    @param {Readme}
    @return {Book}
*/
Book.prototype.setReadme = function(readme) {
    return this.set('readme', readme);
};

/**
    Set the configuration for this book

    @param {Config}
    @return {Book}
*/
Book.prototype.setConfig = function(config) {
    return this.set('config', config);
};

/**
    Set the ignore instance for this book

    @param {Ignore}
    @return {Book}
*/
Book.prototype.setIgnore = function(ignore) {
    return this.set('ignore', ignore);
};

/**
    Change log level

    @param {String} level
    @return {Book}
*/
Book.prototype.setLogLevel = function(level) {
    this.getLogger().setLevel(level);
    return this;
};

/**
    Create a book using a filesystem

    @param {FS} fs
    @return {Book}
*/
Book.createForFS = function createForFS(fs) {
    return new Book({
        fs: fs
    });
};

/**
 * 推断文件的默认扩展名
 * @return {String}
 */
Book.prototype.getDefaultExt = function() {
    // 推断来源
    var clues = [
        this.getReadme(),
        this.getSummary(),
        this.getGlossary()
    ];

    // 列出它们的扩展名
    var exts = clues.map(function (clue) {
        var file = clue.getFile();
        if (file.exists()) {
            return file.getParser().getExtensions().first();
        } else {
            return null;
        }
    });
    // 添加常规默认扩展名
    exts.push('.md');

    // 选择第一个非空
    return exts.find(function (e) { return e !== null; });
};

/**
 * 推断自述文件的默认路径
 * @param {Boolean} [absolute=false] False for a path relative to this book's content root
 * @return {String}
 */
Book.prototype.getDefaultReadmePath = function(absolute) {
    var defaultPath = 'README'+this.getDefaultExt();
    if (absolute) {
        return path.join(this.getContentRoot(), defaultPath);
    } else {
        return defaultPath;
    }
};

/**
    推断摘要的默认路径
    @param {Boolean} [absolute=false] False for a path relative to
        this book's content root
    @return {String}
*/
Book.prototype.getDefaultSummaryPath = function(absolute) {
    var defaultPath = 'SUMMARY'+this.getDefaultExt();
    if (absolute) {
        return path.join(this.getContentRoot(), defaultPath);
    } else {
        return defaultPath;
    }
};

/**
    推断词汇表的默认路径
    @param {Boolean} [absolute=false] False for a path relative to
        this book's content root
    @return {String}
*/
Book.prototype.getDefaultGlossaryPath = function(absolute) {
    var defaultPath = 'GLOSSARY'+this.getDefaultExt();
    if (absolute) {
        return path.join(this.getContentRoot(), defaultPath);
    } else {
        return defaultPath;
    }
};

/**
    从父语言创建语言书

    @param {Book} parent
    @param {String} language
    @return {Book}
*/
Book.createFromParent = function createFromParent(parent, language) {
    var ignore = parent.getIgnore();
    var config = parent.getConfig();

    // Set language in configuration
    config = config.setValue('language', language);

    return new Book({
        // Inherits config. logegr and list of ignored files
        logger: parent.getLogger(),
        config: config,
        ignore: ignore,

        language: language,
        fs: FS.reduceScope(parent.getContentFS(), language)
    });
};

module.exports = Book;
