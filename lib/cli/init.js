var path = require('path');

var options = require('./options');
var initBook = require('../init');

module.exports = {
    name: 'init [book]',
    description: '设置和创建章节文件',
    options: [
        options.log
    ],
    exec: function(args, kwargs) {
        var bookRoot = path.resolve(process.cwd(), args[0] || './');

        return initBook(bookRoot);
    }
};
