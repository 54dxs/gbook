var path = require('path');
var resolve = require('resolve');
var Immutable = require('immutable');

var Promise = require('../utils/promise');
var error = require('../utils/error');
var timing = require('../utils/timing');

var validatePlugin = require('./validatePlugin');

// 如果错误是 "module not found"，则返回true
// 等待 https://github.com/substack/node-resolve/pull/81 合并
function isModuleNotFound(err) {
    return err.code == 'MODULE_NOT_FOUND' || err.message.indexOf('Cannot find module') >= 0;
}

/**
 * 在 book 中加载一个插件
 *
 * @param {Book} book
 * @param {Plugin} plugin
 * @return {Promise<Plugin>}
 */
function loadPlugin(book, plugin) {
    var logger = book.getLogger();

    var name = plugin.getName();
    var pkgPath = plugin.getPath();

    // 尝试从不同位置加载插件
    var p = Promise()
    .then(function() {
        var packageContent;
        var packageMain;
        var content;

        // 找到plugin并加载package.json
        try {
            var res = resolve.sync('./package.json', { basedir: pkgPath });

            pkgPath = path.dirname(res);
            packageContent = require(res);
        } catch (err) {
            if (!isModuleNotFound(err)) throw err;

            packageContent = undefined;
            content = undefined;

            return;
        }

        // 找到主程序包
        try {
            var indexJs = path.normalize(packageContent.main || 'index.js');
            packageMain = resolve.sync('./' + indexJs, { basedir: pkgPath });
        } catch (err) {
            if (!isModuleNotFound(err)) throw err;
            packageMain = undefined;
        }

        // 加载插件JS内容
        if (packageMain) {
            try {
                content = require(packageMain);
            } catch(err) {
                throw new error.PluginError(err, {
                    plugin: name
                });
            }
        }

        // 更新插件
        return plugin.merge({
            'package': Immutable.fromJS(packageContent),
            'content': Immutable.fromJS(content || {})
        });
    })

    .then(validatePlugin);

    p = timing.measure('plugin.load', p);

    logger.info('loading plugin "' + name + '"... ');
    return logger.info.promise(p);
}


module.exports = loadPlugin;
