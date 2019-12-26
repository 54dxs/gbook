var encodeFile = require('./encodeFile');
var encodeGlossaryEntry = require('./encodeGlossaryEntry');

/**
    将glossary编码为JSON

    @param {Glossary}
    @return {Object}
*/
function encodeGlossary(glossary) {
    var file = glossary.getFile();
    var entries = glossary.getEntries();

    return {
        file: encodeFile(file),
        entries: entries
            .map(encodeGlossaryEntry).toJS()
    };
}

module.exports = encodeGlossary;
