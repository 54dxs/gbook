var Promise = require('../utils/promise');
var error = require('../utils/error');
var render = require('./render');

/**
 * 根据文件创建一个模板
 *
 * @param {TemplateEngine} engine
 * @param {String} filePath
 * @param {Object} context
 * @return {Promise<TemplateOutput>}
 */
function renderTemplateFile(engine, filePath, context) {
    var loader = engine.getLoader();

    // 解析文件路径
    var resolvedFilePath = loader.resolve(null, filePath);

    return Promise()
    .then(function() {
        if (!loader.async) {
            return loader.getSource(resolvedFilePath);
        }

        var deferred = Promise.defer();
        loader.getSource(resolvedFilePath, deferred.makeNodeResolver());
        return deferred.promise;
    })
    .then(function(result) {
        if (!result) {
            throw error.TemplateError(new Error('Not found'), {
                filename: filePath
            });
        }

        return render(engine, result.path, result.src, context);
    });

}

module.exports = renderTemplateFile;
