var is = require('is');
var semver = require('semver');// 版本号信息处理
var Immutable = require('immutable');

var PREFIX = require('../constants/pluginPrefix');
var DEFAULT_VERSION = '*';

/**
 * PluginDependency表示有关插件的信息
 * 存储在config.plugins中
 */
var PluginDependency = Immutable.Record({
    name:       String(),

    // 必要条件 version (ex: ">1.0.0")
    version:    String(DEFAULT_VERSION),

    // 这个插件是启用的还是禁用的？
    enabled:    Boolean(true)
}, 'PluginDependency');

PluginDependency.prototype.getName = function() {
    return this.get('name');
};

PluginDependency.prototype.getVersion = function() {
    return this.get('version');
};

PluginDependency.prototype.isEnabled = function() {
    return this.get('enabled');
};

/**
 * 切换此插件状态
 * @param  {Boolean}
 * @return {PluginDependency}
 */
PluginDependency.prototype.toggle = function(state) {
    if (is.undef(state)) {
        state = !this.isEnabled();
    }

    return this.set('enabled', state);
};

/**
 * 返回依赖项的NPM ID
 * @return {String}
 */
PluginDependency.prototype.getNpmID = function() {
    return PluginDependency.nameToNpmID(this.getName());
};

/**
 * 插件是否使用git依赖项
 * @return {Boolean}
 */
PluginDependency.prototype.isGitDependency = function() {
    return !semver.validRange(this.getVersion());
};

/**
 * 创建一个带有名称和插件的插件
 * @param {String}
 * @return {Plugin|undefined}
 */
PluginDependency.create = function(name, version, enabled) {
    if (is.undefined(enabled)) {
        enabled = true;
    }

    return new PluginDependency({
        name: name,
        version: version || DEFAULT_VERSION,
        enabled: Boolean(enabled)
    });
};

/**
 * 从字符串创建插件
 * @param {String}
 * @return {Plugin|undefined}
 */
PluginDependency.createFromString = function(s) {
    var parts = s.split('@');
    var name = parts[0];
    var version = parts.slice(1).join('@');
    var enabled = true;

    if (name[0] === '-') {
        enabled = false;
        name = name.slice(1);
    }

    return new PluginDependency({
        name: name,
        version: version || DEFAULT_VERSION,
        enabled: enabled
    });
};

/**
 * 从字符串创建PluginDependency
 * @param {String}
 * @return {List<PluginDependency>}
 */
PluginDependency.listFromString = function(s) {
    var parts = s.split(',');
    return PluginDependency.listFromArray(parts);
};

/**
 * 从数组创建一个独立于PluginDependency
 * @param {Array}
 * @return {List<PluginDependency>}
 */
PluginDependency.listFromArray = function(arr) {
    return Immutable.List(arr)
        .map(function(entry) {
            if (is.string(entry)) {
                return PluginDependency.createFromString(entry);
            } else {
                return PluginDependency({
                    name: entry.get('name'),
                    version: entry.get('version')
                });
            }
        })
        .filter(function(dep) {
            return Boolean(dep.getName());
        });
};

/**
 * 将插件依赖项导出为数组
 * @param {List<PluginDependency>} list
 * @return {Array<String>}
 */
PluginDependency.listToArray = function(list) {
    return list
        .map(function(dep) {
            var result = '';

            if (!dep.isEnabled()) {
                result += '-';
            }

            result += dep.getName();
            if (dep.getVersion() !== DEFAULT_VERSION) {
                result += '@' + dep.getVersion();
            }

            return result;
        })
        .toJS();
};

/**
 * 返回插件名称的NPM id
 * @param {String}
 * @return {String}
 */
PluginDependency.nameToNpmID = function(s) {
    return PREFIX + s;
};

module.exports = PluginDependency;
