var pkg = require('./package.json');

module.exports = {
    // Documentation for GBook is stored under "docs"
    root: './docs',
    title: 'GBook Toolchain Documentation',

    // Enforce use of GBook v3
    gbook: '3.1.1',

    // Use the "official" theme
    plugins: ['theme-official@2.1.1', '-sharing', '-fontsettings', 'sitemap'],

    variables: {
        version: pkg.version
    },

    pluginsConfig: {
        sitemap: {
            hostname: 'https://gbook.54dxs.cn'
        }
    }
};
