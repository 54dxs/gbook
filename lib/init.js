var path = require('path');

var createNodeFS = require('./fs/node');
var fs = require('./utils/fs');
var Promise = require('./utils/promise');
var File = require('./models/file');
var Readme = require('./models/readme');
var Book = require('./models/book');
var Parse = require('./parse');

/**
 * 初始化book的文件夹结构
 * 读取 SUMMARY 文件,以创建正确的章节
 *
 * @param {String} rootFolder 根文件夹
 * @return {Promise}
 */
function initBook(rootFolder) {
    var extension = '.md';

    return fs.mkdirp(rootFolder)

    // 分析 summary 和 readme 文件
    .then(function() {
        var fs = createNodeFS(rootFolder);
        var book = Book.createForFS(fs);

        return Parse.parseReadme(book)

        // 如果没有找到 readme 文件,则设置默认readme文件
        .fail(function() {
            var readmeFile = File.createWithFilepath('README' + extension);
            var readme = Readme.create(readmeFile);
            return book.setReadme(readme);
        });
    })
    .then(Parse.parseSummary)

    .then(function(book) {
        var logger = book.getLogger();
        var summary = book.getSummary();
        var summaryFile = summary.getFile();
        var summaryFilename = summaryFile.getPath() || ('SUMMARY' + extension);

        var articles = summary.getArticlesAsList();

        // 遍历 SUMMARY.md 并生成对应.md文件 如果.md文件有目录将自动生成
        // 如果 .md 文件已经存在,则return
        return Promise.forEach(articles, function(article) {
            var articlePath = article.getPath();
            var filePath = articlePath? path.join(rootFolder, articlePath) : null;
            // 如果是章节标题,不带.md链接,则return
            if (!filePath) {
                return;
            }

            return fs.assertFile(filePath, function() {
                // 如果 filePath 未找到,则创建
                return fs.ensureFile(filePath)
                .then(function() {
                    // 创建成功,打印日志,并向文件写入章节标题内容
                    logger.info.ln('创建', article.getPath());
                    return fs.writeFile(filePath, '# ' + article.getTitle() + '\n\n');
                });
            });
        })

        // 创建 SUMMARY.md 文件
        .then(function() {
            var filePath = path.join(rootFolder, summaryFilename);

            return fs.ensureFile(filePath)
            .then(function() {
                logger.info.ln('创建 ' + path.basename(filePath));
                return fs.writeFile(filePath, summary.toText(extension));
            });
        })

        // 最后打印init完成的日志
        .then(function() {
            logger.info.ln('初始化完成');
        });
    });
}

module.exports = initBook;
