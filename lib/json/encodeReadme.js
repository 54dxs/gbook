var encodeFile = require('./encodeFile');

/**
    将readme编码为JSON

    @param {Readme}
    @return {Object}
*/
function encodeReadme(readme) {
    var file = readme.getFile();

    return {
        file: encodeFile(file)
    };
}

module.exports = encodeReadme;
