var Logger = require('../utils/logger');

var logOptions = {
    name: 'log',
    description: '要显示的最低日志级别',
    values: Logger.LEVELS
        .keySeq()
        .map(function(s) {
            return s.toLowerCase();
        }).toJS(),
    defaults: 'info'
};

var formatOption = {
    name: 'format',
    description: 'Format to build to',
    values: ['website', 'json', 'ebook'],
    defaults: 'website'
};

var timingOption = {
    name: 'timing',
    description: 'Print timing debug information',
    defaults: false
};

module.exports = {
    log: logOptions,
    format: formatOption,
    timing: timingOption
};
