var is = require('is');
var objectPath = require('object-path');

var logged = {};
var disabled = {};

/**
    记录不赞成的通知

    @param {Book|Output} book
    @param {String} key
    @param {String} message
*/
function logNotice(book, key, message) {
    if (logged[key] || disabled[key]) return;

    logged[key] = true;

    var logger = book.getLogger();
    logger.warn.ln(message);
}

/**
    否决一个函数

    @param {Book|Output} book
    @param {String} key: 不推荐使用的唯一标识符
    @param {Function} fn
    @param {String} msg: 调用时要打印的消息
    @return {Function}
*/
function deprecateMethod(book, key, fn, msg) {
    return function() {
        logNotice(book, key, msg);

        return fn.apply(this, arguments);
    };
}

/**
    否决对象的属性

    @param {Book|Output} book
    @param {String} key: 不推荐使用的唯一标识符
    @param {Object} instance
    @param {String|Function} property
    @param {String} msg: 调用时要打印的消息
    @return {Function}
*/
function deprecateField(book, key, instance, property, value, msg) {
    var store = undefined;

    var prepare = function() {
        if (!is.undefined(store)) return;

        if (is.fn(value)) store = value();
        else store = value;
    };

    var getter = function(){
        prepare();

        logNotice(book, key, msg);
        return store;
    };
    var setter = function(v) {
        prepare();

        logNotice(book, key, msg);
        store = v;
        return store;
    };

    Object.defineProperty(instance, property, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}

/**
    启用否决

    @param {String} key: 独一无二的
*/
function enableDeprecation(key) {
    disabled[key] = false;
}

/**
    禁用否决

    @param {String} key: 独一无二的
*/
function disableDeprecation(key) {
    disabled[key] = true;
}

/**
    反对一种方法而赞成另一种方法

    @param {Book} book
    @param {String} key
    @param {Object} instance
    @param {String} oldName
    @param {String} newName
*/
function deprecateRenamedMethod(book, key, instance, oldName, newName, msg) {
    msg = msg || ('"' + oldName + '" is deprecated, use "' + newName + '()" instead');
    var fn = objectPath.get(instance, newName);

    instance[oldName] = deprecateMethod(book, key, fn, msg);
}

module.exports = {
    method: deprecateMethod,
    renamedMethod: deprecateRenamedMethod,
    field: deprecateField,
    enable: enableDeprecation,
    disable: disableDeprecation
};
