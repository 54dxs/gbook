var path = require('path');
var url = require('url');

var LocationUtils = require('../../utils/location');
var editHTMLElement = require('./editHTMLElement');

/**
    解析所有HTML链接:
        - /test.md in hello -> ../test.html

    @param {String} currentFile
    @param {Function(String) -> String} resolveFile
    @param {HTMLDom} $
*/
function resolveLinks(currentFile, resolveFile, $) {
    var currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, 'a', function($a) {
        var href = $a.attr('href');// href---> doc/README1.md

        // 不要在没有href的情况下更改标记
        if (!href) {
            return;
        }

        if (LocationUtils.isExternal(href)) {
            $a.attr('target', '_blank');
            return;
        }

        // 分离锚 anchor
/*      parsed---> Url {
          protocol: null,
          slashes: null,
          auth: null,
          host: null,
          port: null,
          hostname: null,
          hash: null,
          search: null,
          query: null,
          pathname: 'doc/README1.md',
          path: 'doc/README1.md',
          href: 'doc/README1.md'
        }
        href---> doc/README1.md */
        var parsed = url.parse(href);
        href = parsed.pathname || '';

        if (href) {
            // 计算绝对路径
            href = LocationUtils.toAbsolute(href, currentDirectory, '.');// href---> doc/README1.md

            // 解析文件
            href = resolveFile(href);// href---> doc/README1.html

            // 转换回相对
            href = LocationUtils.relative(currentDirectory, href);// href---> doc/README1.html
        }

        // 添加锚 anchor
        href = href + (parsed.hash || '');// href---> doc/README1.html

        $a.attr('href', href);
    });
}

module.exports = resolveLinks;
