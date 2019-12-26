var Immutable = require('immutable');

var THEME_PREFIX = require('../constants/themePrefix');

var TYPE_PLUGIN = 'plugin';
var TYPE_THEME  = 'theme';


/**
 * 返回给定插件名称的插件类型
 * 当是名称中包含 theme- 时,则返回theme,否则返回plugin
 *
 * @param {Plugin} plugin
 * @return {String}
 */
function pluginType(plugin) {
    var name = plugin.getName();
    return (name && name.indexOf(THEME_PREFIX) === 0) ? TYPE_THEME : TYPE_PLUGIN;
}


/**
 * 排序依赖项列表以匹配book.json中的列表
 * 主题应该总是在插件之后加载
 *
 * @param {List<PluginDependency>} plugins
 * @return {List<PluginDependency>}
 * 
List[
	PluginDependency {
		"name": "livereload",
		"version": "*",
		"enabled":true
	}, PluginDependency {
		"name": "highlight",
		"version": "2.0.2",
		"enabled":true
	}, PluginDependency {
		"name": "search",
		"version": "2.2.1",
		"enabled": true
	}, PluginDependency {
		"name": "lunr",
		"version": "1.2.0",
		"enabled": true
	}, PluginDependency {
		"name": "sharing",
		"version": "1.0.2",
		"enabled": true
	}, PluginDependency {
		"name": "fontsettings",
		"version": "2.0.0",
		"enabled": true
	}, PluginDependency {
		"name": "theme-default",
		"version": "1.0.7",
		"enabled": true
	}
]
 */
function sortDependencies(plugins) {
    var byTypes = plugins.groupBy(pluginType);

    /* byTypes--->OrderedMap {
    	"plugin": List[
    		PluginDependency {
    			"name": "livereload",
    			"version": "*",
    			"enabled": true
    		}, PluginDependency {
    			"name": "highlight",
    			"version": "2.0.2",
    			"enabled": true
    		}, PluginDependency {
    			"name": "search",
    			"version": "2.2.1",
    			"enabled": true
    		}, PluginDependency {
    			"name": "lunr",
    			"version": "1.2.0",
    			"enabled": true
    		}, PluginDependency {
    			"name": "sharing",
    			"version": "1.0.2",
    			"enabled": true
    		}, PluginDependency {
    			"name": "fontsettings",
    			"version": "2.0.0",
    			"enabled": true
    		}
    	],
    	"theme": List[PluginDependency {
    			"name": "theme-default",
    			"version": "1.0.7",
    			"enabled": true
    		}
    	]
    } */

    return byTypes.get(TYPE_PLUGIN, Immutable.List())
        .concat(byTypes.get(TYPE_THEME, Immutable.List()));
}

module.exports = sortDependencies;
