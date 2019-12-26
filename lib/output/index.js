var Immutable = require('immutable');

var generators = Immutable.List([
    require('./json'),
    require('./website'),
    require('./ebook')
]);

/**
 * 按名称返回特定生成器
 *
 * @param {String} name json:json格式数据; website:网站; ebook:电子书
 * @return {Generator}
 */
function getGenerator(name) {
    return generators.find(function(generator) {
        return generator.name == name;
    });
}

module.exports = {
    generate:           require('./generateBook'),
    getGenerator:       getGenerator
};
