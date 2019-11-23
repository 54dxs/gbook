var Immutable = require('immutable');

var File = require('./file');
var Language = require('./language');

var Languages = Immutable.Record({
    file:       File(),
    list:       Immutable.OrderedMap()
});

Languages.prototype.getFile = function() {
    return this.get('file');
};

Languages.prototype.getList = function() {
    return this.get('list');
};

/**
 * 获取默认语言
 * @return {Language}
 */
Languages.prototype.getDefaultLanguage = function() {
    return this.getList().first();
};

/**
 * 根据语言的ID获取语言
 * @param {String} lang
 * @return {Language}
 */
Languages.prototype.getLanguage = function(lang) {
    return this.getList().get(lang);
};

/**
 * 返回langs计数
 * @return {Number}
 */
Languages.prototype.getCount = function() {
    return this.getList().size;
};

/**
 * 从JS对象创建语言列表
 * @param {File} file
 * @param {Array} langs
 * @return {Language}
 */
Languages.createFromList = function(file, langs) {
    var list = Immutable.OrderedMap();

    langs.forEach(function(lang) {
        lang = Language({
            title: lang.title,
            path: lang.ref
        });
        list = list.set(lang.getID(), lang);
    });

    return Languages({
        file: file,
        list: list
    });
};

module.exports = Languages;
