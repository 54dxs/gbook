/**
    解码从JS API到config对象的更改

    @param {Config} config
    @param {Object} result: result from API
    @return {Config}
*/
function decodeGlobal(config, result) {
    var values = result.values;

    delete values.generator;
    delete values.output;

    return config.updateValues(values);
}

module.exports = decodeGlobal;
