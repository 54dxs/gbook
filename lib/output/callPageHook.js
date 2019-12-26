var Api = require('../api');
var callHook = require('./callHook');

/**
    调用特定页的钩子

    @param {String} name
    @param {Output} output
    @param {Page} page
    @return {Promise<Page>}
*/
function callPageHook(name, output, page) {
    return callHook(
        name,

        function(out) {
            return Api.encodePage(out, page);
        },

        function(out, result) {
            return Api.decodePage(out, page, result);
        },

        output
    );
}

module.exports = callPageHook;
