var Immutable = require('immutable');
var parsers = require('../parsers');

/**
 * 返回可应用于模板引擎文件的所有快捷方式的列表
 *
 * @param {List<TemplateBlock>} engine
 * @param {String} filePath
 * @return {List<TemplateShortcut>}
 */
function listShortcuts(blocks, filePath) {
    var parser = parsers.getForFile(filePath);

    if (!parser) {
        return Immutable.List();
    }

    return blocks
        .map(function(block) {
            return block.getShortcuts();
        })
        .filter(function(shortcuts) {
            return (
                shortcuts &&
                shortcuts.acceptParser(parser.getName())
            );
        });
}

module.exports = listShortcuts;
