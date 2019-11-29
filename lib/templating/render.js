var Promise = require('../utils/promise');
var timing = require('../utils/timing');
var TemplateOutput = require('../models/templateOutput');
var replaceShortcuts = require('./replaceShortcuts');

/**
 * 生成一个模板
 *
 * @param {TemplateEngine} engine
 * @param {String} filePath: absolute path for the loader
 * @param {String} content
 * @param {Object} context (optional)
 * @return {Promise<TemplateOutput>}
 */
function renderTemplate(engine, filePath, content, context) {
    context = context || {};

    // 可变对象包含所有需要后处理(post-processing)的blocks
    var blocks = {};

    // 创造nunjucks环境
    var env = engine.toNunjucks(blocks);

    // 替换插件blocks中的快捷方式
    content = replaceShortcuts(engine.getBlocks(), filePath, content);

    return timing.measure(
        'template.render',

        Promise.nfcall(
            env.renderString.bind(env),
            content,
            context,
            {
                path: filePath
            }
        )
        .then(function(content) {
            return TemplateOutput.create(content, blocks);
        })
    );
}

module.exports = renderTemplate;
