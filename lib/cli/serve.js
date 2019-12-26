/* eslint-disable no-console */

var tinylr = require('tiny-lr');
var open = require('open');
var color = require('bash-color');

var Parse = require('../parse');
var Output = require('../output');
var ConfigModifier = require('../modifiers').Config;

var Promise = require('../utils/promise');

var options = require('./options');
var getBook = require('./getBook');
var getOutputFolder = require('./getOutputFolder');
var Server = require('./server');
var watch = require('./watch');

var server, lrServer, lrPath;

function waitForCtrlC() {
    var d = Promise.defer();

    process.on('SIGINT', function() {
        d.resolve();
    });

    return d.promise;
}

/**
 * 生成book
 *
 * @param {Object} args ---> [ './', './_a' ]
 * @param {Object} kwargs ---> {
	port: 4000,
	lrport: 35729,
	watch: true,
	live: true,
	open: false,
	browser: '',
	log: 'info',
	format: 'website'
}
 */
function generateBook(args, kwargs) {
    // kwargs['log'] = 'debug';
    var port = kwargs.port;
    var outputFolder = getOutputFolder(args);// D:\GitHub\node\testbook\_book
    var book = getBook(args, kwargs);// 得到一个book实例
    var Generator = Output.getGenerator(kwargs.format);// 获得一个website输出流生成器
    var browser = kwargs['browser'];

    var hasWatch = kwargs['watch'];
    var hasLiveReloading = kwargs['live'];
    var hasOpen = kwargs['open'];

    // 如果服务是运行的,则停止
    if (server.isRunning()) console.log('Stopping server');

    return server.stop()
    .then(function() {
        // 读取本地配置文件(README.md,SUMMARY.md,book.json)并解析,生成book结构树,以供后续操作
        return Parse.parseBook(book)
        .then(function(resultBook) {

            if (hasLiveReloading) {
                // 启用livereload插件
                var config = resultBook.getConfig();
                config = ConfigModifier.addPlugin(config, 'livereload');
                resultBook = resultBook.set('config', config);
            }

            // 开始生成_book目录内容
            return Output.generate(Generator, resultBook, {
                root: outputFolder
            });
        });
    })
    .then(function() {
        console.log();
        console.log('服务启动中 ...');
        return server.start(outputFolder, port);
    })
    .then(function() {
        console.log('服务 book 已启动,请用浏览器打开', color.green('http://localhost:'+port));

        if (lrPath && hasLiveReloading) {
            // trigger livereload
            lrServer.changed({
                body: {
                    files: [lrPath]
                }
            });
        }

        // if (hasOpen) {
            open('http://localhost:'+port, browser);
        // }
    })
    .then(function() {
        if (!hasWatch) {
            return waitForCtrlC();
        }

        return watch(book.getRoot())
        .then(function(filepath) {
            // set livereload path
            lrPath = filepath;
            console.log('Restart after change in file', filepath);
            console.log('');
            return generateBook(args, kwargs);
        });
    });
}

module.exports = {
    name: 'serve [book] [output]',
    description: '把这本书作为测试的网站',
    options: [
        {
            name: 'port',
            description: '服务监听端口,默认4000',
            defaults: 4000
        },
        {
            name: 'lrport',
            description: '热重载服务的监听端口,默认35729',
            defaults: 35729
        },
        {
            name: 'watch',
            description: '启用文件监听器,当监听到文件发生变更,则实时重载,默认开启',
            defaults: true
        },
        {
            name: 'live',
            description: '启用实时重载,默认开启',
            defaults: true
        },
        {
            name: 'open',
            description: '启用在浏览器中打开book,默认关闭',
            defaults: false
        },
        {
            name: 'browser',
            description: '指定打开book的浏览器',
            defaults: ''
        },
        options.log,
        options.format
    ],
    exec: function(args, kwargs) {
        server = new Server();
        var hasWatch = kwargs['watch'];
        var hasLiveReloading = kwargs['live'];

        return Promise()
        .then(function() {
            if (!hasWatch || !hasLiveReloading) {
                return;
            }

            lrServer = tinylr({});
            return Promise.nfcall(lrServer.listen.bind(lrServer), kwargs.lrport)
            .then(function() {
                console.log('已启动实时重载监听服务, 监听端口为:', kwargs.lrport);
                console.log('按 CTRL+C 退出 ...');
                console.log('');
            });
        })
        .then(function() {
            return generateBook(args, kwargs);
        });
    }
};
