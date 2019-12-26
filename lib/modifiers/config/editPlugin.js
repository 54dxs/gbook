/**
 * 编辑插件的配置
 * 
 * @param {Config} config
 * @param {String} pluginName
 * @param {Object} pluginConfig
 * @return {Config}
 */
function editPlugin(config, pluginName, pluginConfig) {
    return config.setValue('pluginsConfig.'+pluginName, pluginConfig);
}

module.exports = editPlugin;
