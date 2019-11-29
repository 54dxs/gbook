var Immutable = require('immutable');

var Promise = require('../utils/promise');
var timing = require('../utils/timing');
var findInstalled = require('./findInstalled');
var locateRootFolder = require('./locateRootFolder');

/**
 * 列出 book 中安装的所有插件
 *
 * @param {Book}
 * @return {Promise<OrderedMap<String:Plugin>>}
 */
function findForBook(book) {
    return timing.measure(
        'plugins.findForBook',

        Promise.all([
            findInstalled(locateRootFolder()),
            findInstalled(book.getRoot())
        ])

        // 合并所有插件
        .then(function(results) {
            return Immutable.List(results)
                .reduce(function(out, result) {
                    return out.merge(result);
                }, Immutable.OrderedMap());
        })
    );
}


module.exports = findForBook;
