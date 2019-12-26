var Immutable = require('immutable');

var TemplateOutput = Immutable.Record({
    // 模板的文本内容
    content:        String(),

    // Map of blocks to replace / post process
    blocks:         Immutable.Map()
}, 'TemplateOutput');

TemplateOutput.prototype.getContent = function() {
    return this.get('content');
};

TemplateOutput.prototype.getBlocks = function() {
    return this.get('blocks');
};

/**
 * 更新此输出的内容
 * @param {String} content
 * @return {TemplateContent}
 */
TemplateOutput.prototype.setContent = function(content) {
    return this.set('content', content);
};

/**
 * 从文本内容创建模板输出
 * 以及包含block定义的对象
 *
 * @param {String} content
 * @param {Object} blocks
 * @return {TemplateOutput}
 */
TemplateOutput.create = function(content, blocks) {
    return new TemplateOutput({
        content:    content,
        blocks:     Immutable.fromJS(blocks)
    });
};

module.exports = TemplateOutput;
