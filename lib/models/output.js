var Immutable = require('immutable');

var Book = require('./book');
var LocationUtils = require('../utils/location');

var Output = Immutable.Record({
    book:       Book(),

    // 正在使用的生成器的名称
    generator:  String(),

    // Map of plugins to use (String -> Plugin)
    plugins:    Immutable.OrderedMap(),

    // Map pages to generation (String -> Page)
    pages:      Immutable.OrderedMap(),

    // List assets (String)
    assets:     Immutable.List(),

    // 生成器的参数可选项
    options:    Immutable.Map(),

    // Internal state for the generator
    state:      Immutable.Map()
});

Output.prototype.getBook = function() {
    return this.get('book');
};

Output.prototype.getGenerator = function() {
    return this.get('generator');
};

Output.prototype.getPlugins = function() {
    return this.get('plugins');
};

Output.prototype.getPages = function() {
    return this.get('pages');
};

Output.prototype.getOptions = function() {
    return this.get('options');
};

Output.prototype.getAssets = function() {
    return this.get('assets');
};

Output.prototype.getState = function() {
    return this.get('state');
};

/**
 * 按文件路径返回页面
 *
 * @param {String} filePath
 * @return {Page|undefined}
 */
Output.prototype.getPage = function(filePath) {
    filePath = LocationUtils.normalize(filePath);

    var pages = this.getPages();
    return pages.get(filePath);
};

/**
 * 获取输出的根文件夹
 * @return {String}
 */
Output.prototype.getRoot = function() {
    return this.getOptions().get('root');
};

/**
 * 更新输出状态
 * @param {Map} newState
 * @return {Output}
 */
Output.prototype.setState = function(newState) {
    return this.set('state', newState);
};

/**
 * 更新options
 * @param {Map} newOptions
 * @return {Output}
 */
Output.prototype.setOptions = function(newOptions) {
    return this.set('options', newOptions);
};

/**
 * 返回此输出的logegr（与book相同）
 * @return {Logger}
 */
Output.prototype.getLogger = function() {
    return this.getBook().getLogger();
};

module.exports = Output;
