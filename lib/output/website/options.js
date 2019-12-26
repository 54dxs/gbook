var Immutable = require('immutable');

var Options = Immutable.Record({
    // 输出的根文件夹
    root:               String(),

    // 生成前缀
    prefix:             String('website'),

    // 使用目录索引url而不是 "index.html"
    directoryIndex:     Boolean(true)
});

module.exports = Options;
