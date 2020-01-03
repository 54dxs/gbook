var semver = require('semver');
var pkg = require('../package.json');

var VERSION = pkg.version;
var VERSION_STABLE = VERSION.replace(/\-(\S+)/g, '');

var START_TIME = new Date();

/**
 * 验证此gbook版本是否满足要求
 * 我们不能直接使用samver.satisfies，因为当gbook版本是预发行版（beta，alpha）时，它会破坏所有插件
 *
 * @param {String} condition
 * @return {Boolean}
 */
function satisfies(condition) {
    // 真实版测试
    if (semver.satisfies(VERSION, condition)) return true;

    // 未来稳定释放测试
    return semver.satisfies(VERSION_STABLE, condition);
}

module.exports = {
    version: pkg.version,
    satisfies: satisfies,
    START_TIME: START_TIME
};
