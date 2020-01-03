var path = require('path');
var Immutable = require('immutable');

describe('findInstalled', function() {
    var findInstalled = require('../findInstalled');

    it('must list default plugins for gbook directory', function() {
        // Read gbook-plugins from package.json
        var pkg = require(path.resolve(__dirname, '../../../package.json'));
        var gbookPlugins = Immutable.Seq(pkg.dependencies)
            .filter(function(v, k) {
                return k.indexOf('gbook-plugin') === 0;
            })
            .cacheResult();

        return findInstalled(path.resolve(__dirname, '../../../'))
        .then(function(plugins) {
            expect(plugins.size >= gbookPlugins.size).toBeTruthy();

            expect(plugins.has('fontsettings')).toBe(true);
            expect(plugins.has('search')).toBe(true);
        });
    });

});
