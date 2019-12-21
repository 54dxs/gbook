var Promise = require('../../utils/promise');

/**
    编辑与选择器匹配的所有元素
    selector选择器
    fn:处理匹配到的元素
*/
function editHTMLElement($, selector, fn) {
    var $elements = $(selector);

    return Promise.forEach($elements, function(el) {
        var $el = $(el);
        return fn($el);
    });
}

module.exports = editHTMLElement;
