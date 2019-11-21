var Immutable = require('immutable');
var IgnoreMutable = require('ignore');// ignore是一个管理器，过滤器和解析器，根据.gitignore 规范使用纯JavaScript实现。

/*
    Immutable version of node-ignore
*/
var Ignore = Immutable.Record({
    ignore: new IgnoreMutable()
}, 'Ignore');

Ignore.prototype.getIgnore = function() {
    return this.get('ignore');
};

/**
 * 校验文件是否在忽略规则列表中
 * @param {String} filename
 * @return {Boolean}
 */
Ignore.prototype.isFileIgnored = function(filename) {
    var ignore = this.getIgnore();
    return ignore.filter([filename]).length == 0;
};

/**
 * 添加忽略规则
 * @param {String} rule
 * @return {Ignore}
 */
Ignore.prototype.add = function(rule) {
    var ignore = this.getIgnore();
    var newIgnore = new IgnoreMutable();

    newIgnore.add(ignore);
    newIgnore.add(rule);

    return this.set('ignore', newIgnore);
};

module.exports = Ignore;
