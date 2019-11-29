var Immutable = require('immutable');
var jsonschema = require('jsonschema');
var jsonSchemaDefaults = require('json-schema-defaults');

var Promise = require('../utils/promise');
var error = require('../utils/error');
var mergeDefaults = require('../utils/mergeDefaults');

/**
 * 验证book的一个插件,并更新该插件在book的配置文件
 * 
 * 
Config {
	"file": Record {
		"path": "",
		"mtime": "Thu Nov 28 2019 11:25:12 GMT+0800 (GMT+08:00)"
	},
	"values": Map {
		"gitbook": "*",
		"theme": "default",
		"variables": Map {},
		"plugins": List["livereload"],
		"pluginsConfig": Map {
			"livereload": Map {},
			"highlight": Map {},
			"search": Map {},
			"lunr": Map {
				"maxIndexSize": 1000000,
				"ignoreSpecialCharacters": false
			},
			"sharing": Map {
				"facebook": true,
				"twitter": true,
				"google": false,
				"weibo": false,
				"instapaper": false,
				"vk": false,
				"all": List["facebook", "google", "twitter", "weibo", "instapaper"]
			},
			"fontsettings": Map {
				"theme": "white",
				"family": "sans",
				"size": 2
			},
			"theme-default": Map {
				"styles": Map {
					"website": "styles/website.css",
					"pdf": "styles/pdf.css",
					"epub": "styles/epub.css",
					"mobi": "styles/mobi.css",
					"ebook": "styles/ebook.css",
					"print": "styles/print.css"
				},
				"showLevel": false
			}
		},
		"structure": Map {
			"langs": "LANGS.md",
			"readme": "README.md",
			"glossary": "GLOSSARY.md",
			"summary": "SUMMARY.md"
		},
		"pdf": Map {
			"pageNumbers": true,
			"fontSize": 12,
			"fontFamily": "Arial",
			"paperSize": "a4",
			"chapterMark": "pagebreak",
			"pageBreaksBefore": "/",
			"margin": Map {
				"right": 62,
				"left": 62,
				"top": 56,
				"bottom": 56
			}
		}
	}
}
 *
 * @param {Book} book
 * @param {Plugin} plugin
 * @return {Book}
 */
function validatePluginConfig(book, plugin) {
    var config = book.getConfig();
    var packageInfos = plugin.getPackage();

    var configKey = [
        'pluginsConfig',
        plugin.getName()
    ].join('.');

    var pluginConfig = config.getValue(configKey, {}).toJS();

    // TODO 在插件的package.json中配置的gitbook字段
    var schema = (packageInfos.get('gitbook') || Immutable.Map()).toJS();
    if (!schema) return book;

    // 规范化 schema
    schema.id = '/' + configKey;
    schema.type = 'object';

    // Validate and throw if invalid
    var v = new jsonschema.Validator();
    var result = v.validate(pluginConfig, schema, {
        propertyName: configKey
    });

    // Throw error
    if (result.errors.length > 0) {
        throw new error.ConfigurationError(new Error(result.errors[0].stack));
    }

    // Insert default values
    var defaults = jsonSchemaDefaults(schema);
    pluginConfig = mergeDefaults(pluginConfig, defaults);


    // 更新配置文件book.json
    config = config.setValue(configKey, pluginConfig);

    // Return new book
    return book.set('config', config);
}

/**
 * 验证插件和返回具有默认值的更新配置。
 *
 * @param {Book} book
 * @param {OrderedMap<String:Plugin>} plugins
 * @return {Promise<Book>}
 */
function validateConfig(book, plugins) {
    return Promise.reduce(plugins, function(newBook, plugin) {
        return validatePluginConfig(newBook, plugin);
    }, book);
}

module.exports = validateConfig;
