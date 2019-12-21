var Promise = require('../utils/promise');
var timing = require('../utils/timing');
var Api = require('../api');

function defaultGetArgument() {
    return undefined;
}

function defaultHandleResult(output, result) {
    return output;
}

/**
 * 调用output的 "global" 钩子
 *
 * @param {String} name 给钩子定义一个名字
 * @param {Function(Output) -> Mixed} getArgument 获取参数的函数
 * @param {Function(Output, result) -> Output} handleResult 处理结果的函数
 * @param {Output} output
 * @return {Promise<Output>}
 */
function callHook(name, getArgument, handleResult, output) {
    getArgument = getArgument || defaultGetArgument;
    handleResult = handleResult || defaultHandleResult;

    var logger = output.getLogger();
    var plugins = output.getPlugins();

    logger.debug.ln('calling hook "' + name + '"');

    // 为插件创建JS上下文
    var context = Api.encodeGlobal(output);

    return timing.measure(
        'call.hook.' + name,

        // 获取参数
        Promise(getArgument(output))

        // 把钩子串起来
        .then(function(arg) {
            return Promise.reduce(plugins, function(prev, plugin) {
                var hook = plugin.getHook(name);
                if (!hook) {
                    return prev;
                }

                return hook.call(context, prev);
            }, arg);
        })

        // 处理最终结果
        .then(function(result) {
            output = Api.decodeGlobal(output, context);
            return handleResult(output, result);
        })
    );
}

module.exports = callHook;
