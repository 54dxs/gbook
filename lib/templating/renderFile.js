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
        /* result---> {
          src: '{% do %}var template = template || {}; template.stack = template.stack || []; template.stack.push(template.self); template.self = "website\\\\page.html"{% enddo %}\n' +
            '{% extends template.self %}\n' +
            '\n' +
            '{% block search_input %}\n' +
            '<div id="book-search-input" role="search">\n' +
            `    <input type="text" placeholder="{{ 'SEARCH_PLACEHOLDER'|t }}" />\n` +
            '</div>\n' +
            '{% endblock %}\n' +
            '\n' +
            '{% block search_results %}\n' +
            '<div id="book-search-results">\n' +
            '    <div class="search-noresults">\n' +
            '    {{ super() }}\n' +
            '    </div>\n' +
            '    <div class="search-results">\n' +
            '        <div class="has-results">\n' +
            '            {% block search_has_results %}\n' +
            `            <h1 class="search-results-title">{{ 'SEARCH_RESULTS_TITLE'|t|safe }}</h1>\n` +
            '            <ul class="search-results-list"></ul>\n' +
            '            {% endblock %}\n' +
            '        </div>\n' +
            '        <div class="no-results">\n' +
            '            {% block search_no_results %}\n' +
            `            <h1 class="search-results-title">{{ 'SEARCH_NO_RESULTS_TITLE'|t|safe }}</h1>\n` +
            '            {% endblock %}\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>\n' +
            '{% endblock %}\n' +
            '{% do %}template.self = template.stack.pop();{% enddo %}',
          path: 'D:\\GitHub\\node\\gbook\\node_modules\\gitbook-plugin-search\\_layouts\\website\\page.html',
          noCache: true
        } */
        if (!result) {
            throw error.TemplateError(new Error('Not found'), {
                filename: filePath
            });
        }

        return render(engine, result.path, result.src, context);
    });

}

module.exports = renderTemplateFile;
