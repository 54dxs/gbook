var events = require('events');
var http = require('http');
var send = require('send');
var util = require('util');
var url = require('url');

var Promise = require('../utils/promise');

function Server() {
    this.running = null;
    this.dir = null;
    this.port = 0;
    this.sockets = [];
}
util.inherits(Server, events.EventEmitter);

/**
 * 服务是否正在运行
 *
 * @return {Boolean} true:正运行中;false:服务未运行
 */
Server.prototype.isRunning = function() {
    return !!this.running;
};

/**
 * 将服务停止
 *
 * @return {Promise}
 */
Server.prototype.stop = function() {
    var that = this;
    if (!this.isRunning()) return Promise();

    var d = Promise.defer();
    this.running.close(function(err) {
        that.running = null;
        that.emit('state', false);

        if (err) d.reject(err);
        else d.resolve();
    });

    for (var i = 0; i < this.sockets.length; i++) {
        this.sockets[i].destroy();
    }

    return d.promise;
};

/**
 * 启动服务
 *
 * @param {Object} dir
 * @param {Object} port
 * @return {Promise}
 */
Server.prototype.start = function(dir, port) {
    var that = this, pre = Promise();
    port = port || 8004;

    if (that.isRunning()) pre = this.stop();
    return pre
    .then(function() {
        var d = Promise.defer();

        that.running = http.createServer(function(req, res){
            // 渲染 error
            function error(err) {
                res.statusCode = err.status || 500;
                res.end(err.message);
            }

            // 重定向到目录的 index.html
            function redirect() {
                var resultURL = urlTransform(req.url, function(parsed) {
                    parsed.pathname += '/';
                    return parsed;
                });

                res.statusCode = 301;
                res.setHeader('Location', resultURL);
                res.end('Redirecting to ' + resultURL);
            }

            res.setHeader('X-Current-Location', req.url);

            // Send file
            send(req, url.parse(req.url).pathname, {
                root: dir
            })
            .on('error', error)
            .on('directory', redirect)
            .pipe(res);
        });

        that.running.on('connection', function (socket) {
            that.sockets.push(socket);
            socket.setTimeout(4000);
            socket.on('close', function () {
                that.sockets.splice(that.sockets.indexOf(socket), 1);
            });
        });

        that.running.listen(port, function(err) {
            if (err) return d.reject(err);

            that.port = port;
            that.dir = dir;
            that.emit('state', true);
            d.resolve();
        });

        return d.promise;
    });
};

/**
 * 帮助函数，它允许函数转换解析后的url字符串并将新url作为字符串返回
 *
 * @param {String} uri
 * @param {Function} fn
 * @return {String}
 */
function urlTransform(uri, fn) {
    return url.format(fn(url.parse(uri)));
}

module.exports = Server;
