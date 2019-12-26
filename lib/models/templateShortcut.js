var Immutable = require('immutable');
var is = require('is');

/*
    TemplateShortcut在插件的模板块中定义
    使用分隔符将内容替换为模板块。
*/
var TemplateShortcut = Immutable.Record({
    // 接受此快捷方式的分析器名称列表
    parsers:     Immutable.Map(),

    start:       String(),
    end:         String(),

    startTag:    String(),
    endTag:      String()
}, 'TemplateShortcut');

TemplateShortcut.prototype.getStart = function() {
    return this.get('start');
};

TemplateShortcut.prototype.getEnd = function() {
    return this.get('end');
};

TemplateShortcut.prototype.getStartTag = function() {
    return this.get('startTag');
};

TemplateShortcut.prototype.getEndTag = function() {
    return this.get('endTag');
};

TemplateShortcut.prototype.getParsers = function() {
    return this.get('parsers');
};

/**
    测试此快捷方式是否接受分析器

    @param {Parser|String} parser
    @return {Boolean}
*/
TemplateShortcut.prototype.acceptParser = function(parser) {
    if (!is.string(parser)) {
        parser = parser.getName();
    }

    var parserNames = this.get('parsers');
    return parserNames.includes(parser);
};

/**
    为block创建快捷方式

    @param {TemplateBlock} block
    @param {Map} details
    @return {TemplateShortcut}
*/
TemplateShortcut.createForBlock = function(block, details) {
    details = Immutable.fromJS(details);

    return new TemplateShortcut({
        parsers:        details.get('parsers'),
        start:          details.get('start'),
        end:            details.get('end'),
        startTag:       block.getName(),
        endTag:         block.getEndTag()
    });
};

module.exports = TemplateShortcut;
