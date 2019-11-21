var is = require('is');
var Immutable = require('immutable');

var File = require('./file');
var PluginDependency = require('./pluginDependency');
var configDefault = require('../constants/configDefault');
var reducedObject = require('../utils/reducedObject');

var Config = Immutable.Record({
    file:       File(),
    values:     configDefault
}, 'Config');

Config.prototype.getFile = function() {
    return this.get('file');
};

Config.prototype.getValues = function() {
    return this.get('values');
};

/**
 * 返回配置的最低版本，
 * 基本上它返回当前配置减去默认配置
 * @return {Map}
 */
Config.prototype.toReducedVersion = function() {
    return reducedObject(configDefault, this.getValues());
};

/**
 * 将配置呈现为文本
 * @return {Promise<String>}
 */
Config.prototype.toText = function() {
    return JSON.stringify(this.toReducedVersion().toJS(), null, 4);
};

/**
 * 更改配置文件
 * @param {File} file
 * @return {Config}
 */
Config.prototype.setFile = function(file) {
    return this.set('file', file);
};

/**
 * 按its的key路径返回配置值
 * @param {String} key
 * @return {Mixed}
 */
Config.prototype.getValue = function(keyPath, def) {
    var values = this.getValues();
    keyPath = Config.keyToKeyPath(keyPath);

    if (!values.hasIn(keyPath)) {
        return Immutable.fromJS(def);
    }

    return values.getIn(keyPath);
};

/**
 * 更新配置值
 * @param {String} key
 * @param {Mixed} value
 * @return {Config}
 */
Config.prototype.setValue = function(keyPath, value) {
    keyPath = Config.keyToKeyPath(keyPath);

    value = Immutable.fromJS(value);

    var values = this.getValues();
    values = values.setIn(keyPath, value);

    return this.set('values', values);
};

/**
 * 返回插件依赖项列表
 * @return {List<PluginDependency>}
 */
Config.prototype.getPluginDependencies = function() {
    var plugins = this.getValue('plugins');

    if (is.string(plugins)) {
        return PluginDependency.listFromString(plugins);
    } else {
        return PluginDependency.listFromArray(plugins);
    }
};

/**
 * 按名称返回插件依赖项
 * @param {String} name
 * @return {PluginDependency}
 */
Config.prototype.getPluginDependency = function(name) {
    var plugins = this.getPluginDependencies();

    return plugins.find(function(dep) {
        return dep.getName() === name;
    });
};

/**
 * 更新插件依赖项列表
 * @param {List<PluginDependency>}
 * @return {Config}
 */
Config.prototype.setPluginDependencies = function(deps) {
    var plugins = PluginDependency.listToArray(deps);

    return this.setValue('plugins', plugins);
};


/**
 * 更新现有配置的值
 * @param {Object} values
 * @returns {Config}
 */
Config.prototype.updateValues = function(values) {
    values = Immutable.fromJS(values);

    return this.set('values', values);
};

/**
 * 更新现有配置的值
 * @param {Config} config
 * @param {Object} values
 * @returns {Config}
 */
Config.prototype.mergeValues = function(values) {
    var currentValues = this.getValues();
    values = Immutable.fromJS(values);

    currentValues = currentValues.mergeDeep(values);

    return this.set('values', currentValues);
};

/**
 * 为文件创建新配置
 * @param {File} file
 * @param {Object} values
 * @returns {Config}
 */
Config.create = function(file, values) {
    return new Config({
        file: file,
        values: Immutable.fromJS(values)
    });
};

/**
 * 创建新配置
 * @param {Object} values
 * @returns {Config}
 */
Config.createWithValues = function(values) {
    return new Config({
        values: Immutable.fromJS(values)
    });
};


/**
 * 将keyPath转换为keys数组
 * @param {String|Array}
 * @return {Array}
 */
Config.keyToKeyPath = function(keyPath) {
    if (is.string(keyPath)) keyPath = keyPath.split('.');
    return keyPath;
};

module.exports = Config;
