var Promise = require('../utils/promise');


/**
 * 加工后按body替换blocks的位置标记
 * 这样做是为了避免markdown/ascidoc处理器解析块内容
 *
 * @param {String} content
 * @return {Object} {blocks: Set, content: String}
 */
function replaceBlocks(content, blocks) {
    var newContent = content.replace(/\{\{\-\%([\s\S]+?)\%\-\}\}/g, function(match, key) {
        var replacedWith = match;

        var block = blocks.get(key);
        if (block) {
            replacedWith = replaceBlocks(block.get('body'), blocks);
        }

        return replacedWith;
    });

    return newContent;
}

/**
 * Post render a template:
 *     - 对 blocks 执行 "post"
 *     - 替换 block 的内容
 *
 * @param {TemplateEngine} engine
 * @param {TemplateOutput} content
 * @return {Promise<String>}
 */
function postRender(engine, output) {
    var content = output.getContent();
    var blocks = output.getBlocks();

    var result = replaceBlocks(content, blocks);

    return Promise.forEach(blocks, function(block) {
        var post = block.get('post');

        if (!post) {
            return;
        }

        return post();
    })
    .thenResolve(result);
}

module.exports = postRender;
