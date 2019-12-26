var escapeStringRegexp = require('escape-string-regexp');
var listShortcuts = require('./listShortcuts');

/**
 * 将block的快捷方式应用于模板
 *
 * @param {String} content
 * @param {Shortcut} shortcut
 * @return {String}
 */
function applyShortcut(content, shortcut) {
    var start = shortcut.getStart();
    var end = shortcut.getEnd();

    var tagStart = shortcut.getStartTag();
    var tagEnd = shortcut.getEndTag();

    var regex = new RegExp(
        escapeStringRegexp(start) + '([\\s\\S]*?[^\\$])' + escapeStringRegexp(end),
       'g'
    );
    return content.replace(regex, function(all, match) {
        return '{% ' + tagStart + ' %}' + match + '{% ' + tagEnd + ' %}';
    });
}

/**
 * 替换字符串中blocks的快捷方式
 *
 * @param {List<TemplateBlock>} engine
 * @param {String} filePath
 * @param {String} content
 * @return {String}
 */
function replaceShortcuts(blocks, filePath, content) {
    var shortcuts = listShortcuts(blocks, filePath);
    return shortcuts.reduce(applyShortcut, content);
}

module.exports = replaceShortcuts;
