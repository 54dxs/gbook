var Immutable = require('immutable');
var is = require('is');

var timers = {};
var startDate = Date.now();

/**
    测量操作(记录type函数执行次数,总耗时,最小耗时,最大耗时)

    @parqm {String} type
    @param {Promise} p
    @return {Promise}
*/
function measure(type, p) {
    timers[type] = timers[type] || {
        type: type,
        count: 0,
        total: 0,
        min: undefined,
        max: 0
    };

    var start = Date.now();

    return p
    .fin(function() {
        var end = Date.now();
        var duration = (end - start);

        timers[type].count ++;
        timers[type].total += duration;

        if (is.undefined(timers[type].min)) {
            timers[type].min = duration;
        } else {
            timers[type].min = Math.min(timers[type].min, duration);
        }

        timers[type].max = Math.max(timers[type].max, duration);
    });
}

/**
    格式化时间,小于1000时毫秒显示,大于等于时秒显示

    @param {Number} ms
    @return {String}
*/
function time(ms) {
    if (ms < 1000) {
        return (ms.toFixed(0)) + 'ms';
    }

    return (ms/1000).toFixed(2) + 's';
}

/**
    将所有 timers 转存到logger

    @param {Logger} logger
*/
function dump(logger) {
    var prefix = '    > ';
    var measured = 0;
    var totalDuration = Date.now() - startDate;

    // 激活 debug logging
    var logLevel = logger.getLevel();
    logger.setLevel('debug');

    Immutable.Map(timers)
        .valueSeq()
        .sortBy(function(timer) {
            measured += timer.total;
            return timer.total;
        })
        .forEach(function(timer) {
            var percent = (timer.total * 100) / totalDuration;

            logger.debug.ln('"' + timer.type + '" (执行了 ' + timer.count + ' 次), 消耗总执行时长的 ' + percent.toFixed(1));
            logger.debug.ln(prefix + '总共: ' + time(timer.total)+ ' | 平均: ' + time(timer.total / timer.count));
            logger.debug.ln(prefix + '最小: ' + time(timer.min) + ' | 最大: ' + time(timer.max));
            logger.debug.ln('---------------------------');
        });


    logger.debug.ln('在空闲期,耗时' + time(totalDuration - measured));

    // 日志等级回滚到初始等级
    logger.setLevel(logLevel);
}

module.exports = {
    measure: measure,
    dump: dump
};
