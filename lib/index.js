var extend = require('extend');// 深拷贝,合并对象

var common = require('./browser');

// 合并对象并导出
module.exports = extend({
    initBook:       require('./init'),
    createNodeFS:   require('./fs/node'),
    Output:         require('./output'),
    commands:       require('./cli')
}, common);
