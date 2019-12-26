var escape = require('escape-html');

// 要忽略的选择器
var ANNOTATION_IGNORE = '.no-glossary,code,pre,a,script,h1,h2,h3,h4,h5,h6';

function pregQuote( str ) {
    return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, '\\$1');
}

function replaceText($, el, search, replace, text_only ) {
    return $(el).each(function(){
        var node = this.firstChild,
            val,
            new_val,

            // 最后要移除的元素。
            remove = [];

        // 只有在firstChild存在时才继续
        if ( node ) {

            // 循环所有子节点
            while (node) {

                // 仅处理文本节点
                if ( node.nodeType === 3 ) {

                    // 原始节点值
                    val = node.nodeValue;

                    // 新值
                    new_val = val.replace( search, replace );

                    // 只有当新值和原始值不同时才替换文本！
                    if ( new_val !== val ) {

                        if ( !text_only && /</.test( new_val ) ) {
                            // 新值包含HTML，以更慢但更健壮的方式设置它。
                            $(node).before( new_val );

                            // 不要移除节点，否则循环将失去其位置
                            remove.push( node );
                        } else {
                            // 新值不包含HTML，因此可以用这种非常快速、简单的方式设置它
                            node.nodeValue = new_val;
                        }
                    }
                }

                node = node.nextSibling;
            }
        }

        // 是时候移除这些元素了
        if (remove.length) $(remove).remove();
    });
}

/**
 * 使用GlossaryEntry条目列表注释文本
 *
 * @param {List<GlossaryEntry>}
 * @param {String} glossaryFilePath
 * @param {HTMLDom} $
 */
function annotateText(entries, glossaryFilePath, $) {
    entries.forEach(function(entry) {
        var entryId     = entry.getID();
        var name        = entry.getName();
        var description = entry.getDescription();
        var searchRegex = new RegExp( '\\b(' + pregQuote(name.toLowerCase()) + ')\\b' , 'gi' );

        $('*').each(function() {
            var $this = $(this);

            if (
                $this.is(ANNOTATION_IGNORE) ||
                $this.parents(ANNOTATION_IGNORE).length > 0
            ) return;

            replaceText($, this, searchRegex, function(match) {
                return '<a href="/' + glossaryFilePath + '#' + entryId + '" '
                    + 'class="glossary-term" title="' + escape(description) + '">'
                    + match
                    + '</a>';
            });
        });

    });
}

module.exports = annotateText;
