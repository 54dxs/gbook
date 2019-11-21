var is = require('is');// js类型判断库

// 错误包装器
var TypedError = require('error/typed');
var WrappedError = require('error/wrapped');


/**
 * 强制作为错误对象，并清除消息
 * @param {Object} err
 */
function enforce(err) {
    if (is.string(err)) err = new Error(err);
    err.message = err.message.replace(/^Error: /, '');

    return err;
}

/**
 * 解析/生成期间的随机错误包装器
 */
var ParsingError = WrappedError({
    message: '解析错误: {origMessage}',
    type: 'parse'
});
var OutputError = WrappedError({
    message: '输出错误: {origMessage}',
    type: 'generate'
});

/**
 * 文件不存在
 */
var FileNotFoundError = TypedError({
    type: 'file.not-found',
    message: '文件 "{filename}" 不存在 (或是一个忽略文件)',
    filename: null
});

/**
 * 无法解析文件
 */
var FileNotParsableError = TypedError({
    type: 'file.not-parsable',
    message: '文件 "{filename}" 无法解析',
    filename: null
});

/**
 * 文件超出范围
 */
var FileOutOfScopeError = TypedError({
    type: 'file.out-of-scope',
    message: '文件 "{filename}" 不在 "{root}" 中',
    filename: null,
    root: null,
    code: 'EACCESS'
});

/**
 * 文件超出范围
 */
var RequireInstallError = TypedError({
    type: 'install.required',
    message: '"{cmd}" 未安装.\n{install}',
    cmd: null,
    code: 'ENOENT',
    install: ''
});

/**
 * nunjucks 模板错误
 */
var TemplateError = WrappedError({
    message: '编译模板时出错 "{filename}": {origMessage}',
    type: 'template',
    filename: null
});

/**
 * nunjucks 模板错误
 */
var PluginError = WrappedError({
    message: '插件错误 "{plugin}": {origMessage}',
    type: 'plugin',
    plugin: null
});

/**
 * book的配置错误
 */
var ConfigurationError = WrappedError({
    message: 'book的配置错误: {origMessage}',
    type: 'configuration'
});

/**
 * 生成电子书时出错
 */
var EbookError = WrappedError({
    message: '生成电子书时出错: {origMessage}\n{stdout}',
    type: 'ebook',
    stdout: ''
});

module.exports = {
    enforce: enforce,

    ParsingError: ParsingError,
    OutputError: OutputError,
    RequireInstallError: RequireInstallError,

    FileNotParsableError: FileNotParsableError,
    FileNotFoundError: FileNotFoundError,
    FileOutOfScopeError: FileOutOfScopeError,

    TemplateError: TemplateError,
    PluginError: PluginError,
    ConfigurationError: ConfigurationError,
    EbookError: EbookError
};
