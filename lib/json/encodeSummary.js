var encodeFile = require('./encodeFile');
var encodeSummaryPart = require('./encodeSummaryPart');

/**
    将summary编码为JSON

    @param {Summary}
    @return {Object}
*/
function encodeSummary(summary) {
    var file = summary.getFile();
    var parts = summary.getParts();

    return {
        file: encodeFile(file),
        parts: parts.map(encodeSummaryPart).toJS()
    };
}

module.exports = encodeSummary;
