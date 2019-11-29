var Immutable = require('immutable');
var moment = require('moment');

module.exports = Immutable.Map({
    // 格式化日期
    // ex: 'MMMM Do YYYY, h:mm:ss a
    date: function(time, format) {
        return moment(time).format(format);
    },

    // 相对时间
    dateFromNow: function(time) {
        return moment(time).fromNow();
    }
});
