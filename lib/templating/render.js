var Promise = require('../utils/promise');
var timing = require('../utils/timing');
var TemplateOutput = require('../models/templateOutput');
var replaceShortcuts = require('./replaceShortcuts');

/**
 * 生成一个模板
 *
 * @param {TemplateEngine} engine 模板引擎
 * @param {String} filePath: 待处理.md文件的绝对地址
 * @param {String} content 已初步处理过的.md文件内容
 * @param {Object} context (optional) json格式的结构文件(上下文,一些配置信息)
 * @return {Promise<TemplateOutput>}
 */
function renderTemplate(engine, filePath, content, context) {
    context = context || {};

    // 可变对象包含所有需要后处理(post-processing)的blocks
    var blocks = {};

    // 创造nunjucks环境
    var env = engine.toNunjucks(blocks);

    // 替换插件blocks中的快捷方式
    content = replaceShortcuts(engine.getBlocks(), filePath, content);
    /* context---> {
      summary: {
        file: {
          path: 'SUMMARY.md',
          mtime: 2019-11-26T11:52:20.920Z,
          type: 'markdown'
        },
        parts: [{
    		title: '',
    		articles: [
    		  {
    			title: '介绍',
    			level: '1.1',
    			depth: 1,
    			anchor: undefined,
    			url: undefined,
    			path: 'README.md',
    			ref: 'README.md',
    			articles: [ [Object] ]
    		  },
    		  {
    			title: '介绍2',
    			level: '1.2',
    			depth: 1,
    			anchor: undefined,
    			url: undefined,
    			path: 'README2.md',
    			ref: 'README2.md',
    			articles: [ [Object] ]
    		  },
    		  {
    			title: '介绍4',
    			level: '1.3',
    			depth: 1,
    			anchor: undefined,
    			url: undefined,
    			path: 'doc/README4.md',
    			ref: 'doc/README4.md',
    			articles: []
    		  }
    		]
    	}]
      },
      glossary: { file: undefined, entries: {} },
      readme: {
        file: {
          path: 'README.md',
          mtime: 2019-12-15T00:27:17.905Z,
          type: 'markdown'
        }
      },
      config: {
        gbook: '*',
        theme: 'default',
        variables: {},
        plugins: [ 'livereload' ],
        pluginsConfig: {
          livereload: {},
          highlight: {},
          search: {},
          lunr: [Object],
          sharing: [Object],
          fontsettings: [Object],
          'theme-default': [Object]
        },
        structure: {
          langs: 'LANGS.md',
          readme: 'README.md',
          glossary: 'GLOSSARY.md',
          summary: 'SUMMARY.md'
        },
        pdf: {
          pageNumbers: true,
          fontSize: 12,
          fontFamily: 'Arial',
          paperSize: 'a4',
          chapterMark: 'pagebreak',
          pageBreaksBefore: '/',
          margin: [Object]
        },
        styles: {
          website: 'styles/website.css',
          pdf: 'styles/pdf.css',
          epub: 'styles/epub.css',
          mobi: 'styles/mobi.css',
          ebook: 'styles/ebook.css',
          print: 'styles/print.css'
        }
      },
      languages: undefined,
      gbook: { version: '3.4.2', time: 2019-12-15T04:34:00.648Z },
      book: { language: undefined },
      output: { name: 'website' },
      options: {
        root: 'D:\\GitHub\\node\\testbook\\_book',
        prefix: 'website',
        directoryIndex: true
      },
      page: {
        title: '介绍4',
        level: '1.3',
        depth: 1,
        previous: {
          title: '介绍3',
          level: '1.2.1',
          depth: 2,
          anchor: undefined,
          url: undefined,
          path: 'README3.md',
          ref: 'README3.md',
          articles: []
        },
        content: '<h1 id="&#x4ECB;&#x7ECD;4">&#x4ECB;&#x7ECD;4</h1>\n',
        dir: 'ltr'
      },
      file: {
        path: 'doc/README4.md',
        mtime: 2019-11-26T09:28:35.354Z,
        type: 'markdown'
      },
      plugins: { resources: {
          js: [
            { path: 'gbook-plugin-livereload/plugin.js' },
            { path: 'gbook-plugin-search/search-engine.js' },
            { path: 'gbook-plugin-search/search.js' },
            { path: 'gbook-plugin-lunr/lunr.min.js' },
            { path: 'gbook-plugin-lunr/search-lunr.js' },
            { path: 'gbook-plugin-sharing/buttons.js' },
            { path: 'gbook-plugin-fontsettings/fontsettings.js' }
          ],
          css: [
            { path: 'gbook-plugin-highlight/website.css' },
            { path: 'gbook-plugin-search/search.css' },
            { path: 'gbook-plugin-fontsettings/website.css' }
          ]
      }},
      template: { getJSContext: [Function: getJSContext] },
      basePath: '..'
    } */
    return timing.measure(
        'template.render',

        // 执行渲染
        Promise.nfcall(
            env.renderString.bind(env),
            content,
            context,
            {
                path: filePath
            }
        )
        .then(function(content) {
            // content为渲染后的html代码字符串
            return TemplateOutput.create(content, blocks);
        })
    );
}

module.exports = renderTemplate;
