var path = require('path');
var Immutable = require('immutable');

var Output = require('../models/output');
var Promise = require('../utils/promise');
var fs = require('../utils/fs');

var callHook = require('./callHook');
var preparePlugins = require('./preparePlugins');
var preparePages = require('./preparePages');
var prepareAssets = require('./prepareAssets');
var generateAssets = require('./generateAssets');
var generatePages = require('./generatePages');

/**
 * 处理输出以生成book
 * @param {Generator} generator
 * @param {Output} startOutput
 * @return {Promise<Output>}
 */
function processOutput(generator, startOutput) {
    return Promise(startOutput)
    .then(preparePlugins)
    .then(preparePages)
    .then(prepareAssets)

    .then(
        callHook.bind(null,
            'config',
            function(output) {
                var book = output.getBook();
                var config = book.getConfig();
                var values = config.getValues();

                return values.toJS();
            },
            function(output, result) {
                var book = output.getBook();
                var config = book.getConfig();

                config = config.updateValues(result);
                book = book.set('config', config);
                return output.set('book', book);
            }
        )
    )

    .then(
        callHook.bind(null,
            'init',
            function(output) {
                return {};
            },
            function(output) {
                return output;
            }
        )
    )

    .then(function(output) {
        if (!generator.onInit) {
            return output;
        }

        return generator.onInit(output);
    })

    .then(generateAssets.bind(null, generator))
    .then(generatePages.bind(null, generator))

    .tap(function(output) {
        var book = output.getBook();

        if (!book.isMultilingual()) {
            return;
        }

        var logger = book.getLogger();
        var books = book.getBooks();
        var outputRoot = output.getRoot();
        var plugins = output.getPlugins();
        var state = output.getState();
        var options = output.getOptions();

        return Promise.forEach(books, function(langBook) {
            // 继承插件列表、选项和状态
            var langOptions = options.set('root', path.join(outputRoot, langBook.getLanguage()));
            var langOutput = new Output({
                book:       langBook,
                options:    langOptions,
                state:      state,
                generator:  generator.name,
                plugins:    plugins
            });

            logger.info.ln('');
            logger.info.ln('生成语言 "' + langBook.getLanguage() + '"');
            return processOutput(generator, langOutput);
        });
    })

    .then(callHook.bind(null,
        'finish:before',
            function(output) {
                return {};
            },
            function(output) {
                return output;
            }
        )
    )

    .then(function(output) {
        if (!generator.onFinish) {
            return output;
        }

        return generator.onFinish(output);
    })

    .then(callHook.bind(null,
        'finish',
            function(output) {
                return {};
            },
            function(output) {
                return output;
            }
        )
    );
}

/**
 * 使用 generator 生成一本book
 *
 * 整个生成过程是：
 *     1. 列出并加载本书的插件
 *     2. 调用hook "config"
 *     3. 调用hook "init"
 *     4. 初始化generator生成器
 *     5. 列出所有 assets 和 pages
 *     6. 将所有 assets 复制到 output
 *     7. 生成所有页面
 *     8. 调用hook "finish:before"
 *     9. 完成生成
 *     10. 调用hook "finish"
 *
 * @param {Generator} generator 封装了生成器的Generator
 * @param {Book} book
 * @param {Object} options 参数列表(一个json对象)
 * @return {Promise<Output>}
 */
function generateBook(generator, book, options) {
    options = generator.Options(options);
    var state = generator.State? generator.State({}) : Immutable.Map();
    var start = Date.now();

    return Promise(
        new Output({
            book: book,
            options: options,
            state: state,
            generator: generator.name
        })
    )

    // 清除输出文件夹
    .then(function(output) {
        var logger = output.getLogger();
        var rootFolder = output.getRoot();

        logger.info.ok('清除输出文件夹 "' + rootFolder + '"');

        return fs.ensureFolder(rootFolder)
            .thenResolve(output);
    })

    // 生成book的处理过程
    .then(processOutput.bind(null, generator))

    // 日志持续时间和结束消息
    .then(function(output) {
        var logger = output.getLogger();
        var end = Date.now();
        var duration = (end - start)/1000;

        logger.info.ok('生成完成, 耗时 ' + duration.toFixed(1) + 's !');

        return output;
    });
}

module.exports = generateBook;
