var extend = require('extend');

var gbook = require('../gbook');
var encodeSummary = require('./encodeSummary');
var encodeGlossary = require('./encodeGlossary');
var encodeReadme = require('./encodeReadme');
var encodeLanguages = require('./encodeLanguages');

/**
    将book编码为JSON

    @param {Book}
    @return {Object}
*/
function encodeBookToJson(book) {
    var config = book.getConfig();
    var language = book.getLanguage();

    var variables = config.getValue('variables', {});

    return {
        summary: encodeSummary(book.getSummary()),
        glossary: encodeGlossary(book.getGlossary()),
        readme: encodeReadme(book.getReadme()),
        config: book.getConfig().getValues().toJS(),

        languages: book.isMultilingual()? encodeLanguages(book.getLanguages()) : undefined,

        gbook: {
            version: gbook.version,
            time: gbook.START_TIME
        },
        book: extend({
            language: language? language : undefined
        }, variables.toJS())
    };
}

module.exports = encodeBookToJson;
