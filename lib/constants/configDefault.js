var Immutable = require('immutable');
var jsonSchemaDefaults = require('json-schema-defaults');// 根据JSON模式中的默认值生成JSON对象

var schema = require('./configSchema');

module.exports = Immutable.fromJS(jsonSchemaDefaults(schema));
