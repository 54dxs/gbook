var lastKey = 0;

/*
    生成一个随机key
    @return {String} '00001'
*/
function generateKey() {
    lastKey += 1;
    var str = lastKey.toString(16);
    return '00000'.slice(str.length) + str;
}

module.exports = generateKey;
