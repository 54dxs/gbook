
/**
    将GlossaryEntry编码为JSON

    @param {GlossaryEntry}
    @return {Object}
*/
function encodeGlossaryEntry(entry) {
    return {
        id: entry.getID(),
        name: entry.getName(),
        description: entry.getDescription()
    };
}

module.exports = encodeGlossaryEntry;
