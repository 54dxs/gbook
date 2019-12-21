var is = require('is');
var Immutable = require('immutable');

var Promise = require('../../utils/promise');
var editHTMLElement = require('./editHTMLElement');

/**
    从类名称列表返回代码块的语言

    @param {Array<String>}
    @return {String}
*/
function getLanguageForClass(classNames) {
    return Immutable.List(classNames)
        .map(function(cl) {
            // cl---> lang-js
            // Markdown
            if (cl.search('lang-') === 0) {
                return cl.slice('lang-'.length);
            }

            // Asciidoc
            if (cl.search('language-') === 0) {
                return cl.slice('language-'.length);
            }

            return null;
        })
        .find(function(cl) {
            // cl---> js
            return Boolean(cl);
        });
}


/**
    高亮显示所有code elements

    @param {Function(lang, body) -> String} highlight
    @param {HTMLDom} $
    @return {Promise}
*/
function highlightCode(highlight, $) {
    return editHTMLElement($, 'code', function($code) {
        var classNames = ($code.attr('class') || '').split(' ');// className---> [ 'lang-js' ]
        var lang = getLanguageForClass(classNames);// lang---> js
        // source---> function sayHello(){
        //     console.log('哈哈');
        // }
        var source = $code.text();

        return Promise(highlight(lang, source))
        .then(function(r) {
/*          r---> {
              html: '<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sayHello</span>(<span class="hljs-params"></span>)</span>{\n' +
                `    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'哈哈'</span>);\n` +
                '}\n'
            } */
            if (is.string(r.html)) {
                $code.html(r.html);
            } else {
                $code.text(r.text);
            }
        });
    });
}

module.exports = highlightCode;
