var I18n = require('i18n-t');
var Immutable = require('immutable');

var GeneratorState = Immutable.Record({
    i18n:       I18n(),

    // 插件的资源列表
    resources:  Immutable.Map()
});

GeneratorState.prototype.getI18n = function() {
    return this.get('i18n');
};

GeneratorState.prototype.getResources = function() {
    return this.get('resources');
};

module.exports = GeneratorState;
