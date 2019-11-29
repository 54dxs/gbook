var readInstalled = require('read-installed');
var Immutable = require('immutable');
var path = require('path');

var Promise = require('../utils/promise');
var fs = require('../utils/fs');
var Plugin = require('../models/plugin');
var PREFIX = require('../constants/pluginPrefix');

/**
 * 验证包名是否为GBook插件
 *
 * @return {Boolean}
 */
function validateId(name) {
    return name && name.indexOf(PREFIX) === 0;
}

/**
 * 列出文件夹中安装的所有软件包
 *
 * @param {String} folder
 * @return {OrderedMap<String:Plugin>}
 */
function findInstalled(folder) {
    var options = {
        dev: false,
        log: function() {},
        depth: 4
    };
    var results = Immutable.OrderedMap();

    function onPackage(pkg, parent) {
        if (!pkg.name) return;

        var name = pkg.name;
        var version = pkg.version;
        var pkgPath = pkg.realPath;
        var depth = pkg.depth;
        var dependencies = pkg.dependencies;

        var pluginName = name.slice(PREFIX.length);

        if (!validateId(name)){
            if (parent) return;
        } else {
            results = results.set(pluginName, Plugin({
                name: pluginName,
                version: version,
                path: pkgPath,
                depth: depth,
                parent: parent
            }));
        }

        Immutable.Map(dependencies).forEach(function(dep) {
            onPackage(dep, pluginName);
        });
    }

    // 在node_modules文件夹中搜索gbook插件
    var node_modules = path.join(folder, 'node_modules');

    // 列出 node_modules 中的所有文件夹
    return fs.readdir(node_modules)
    .fail(function() {
        return Promise([]);
    })
    .then(function(modules) {
        return Promise.serie(modules, function(module) {
            // 不是gbook插件
            if (!validateId(module)) {
                return Promise();
            }

            // 读取 gbook 插件的 package 细节
            var module_folder = path.join(node_modules, module);
            return Promise.nfcall(readInstalled, module_folder, options)
            .then(function(data) {
                onPackage(data);
            });
        });
    })
    .then(function() {
        // 返回已安装的插件
        return results;
    });
}

module.exports = findInstalled;
