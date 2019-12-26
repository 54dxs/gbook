var is = require('is');
var extend = require('extend');
var Immutable = require('immutable');

var Promise = require('../utils/promise');
var genKey = require('../utils/genKey');
var TemplateShortcut = require('./templateShortcut');

var NODE_ENDARGS = '%%endargs%%';

var TemplateBlock = Immutable.Record({
    // block的名称，也是开始标记
    name:           String(),

    // 结束标记，默认为"end<name>"
    end:            String(),

    // 处理block内容的函数
    process:        Function(),

    // 字符串列表，用于内部block标记
    blocks:         Immutable.List(),

    // 要替换为此block的快捷方式列表
    shortcuts:      Immutable.Map()
}, 'TemplateBlock');

TemplateBlock.prototype.getName = function() {
    return this.get('name');
};

TemplateBlock.prototype.getEndTag = function() {
    return this.get('end') || ('end' + this.getName());
};

TemplateBlock.prototype.getProcess = function() {
    return this.get('process');
};

TemplateBlock.prototype.getBlocks = function() {
    return this.get('blocks');
};


/**
 * 返回与此block关联的快捷方式或未定义的快捷方式
 * @return {TemplateShortcut|undefined}
 */
TemplateBlock.prototype.getShortcuts = function() {
    var shortcuts = this.get('shortcuts');
    if (shortcuts.size === 0) {
        return undefined;
    }

    return TemplateShortcut.createForBlock(this, shortcuts);
};

/**
 * 返回nunjucks扩展名
 * @return {String}
 */
TemplateBlock.prototype.getExtensionName = function() {
    return 'Block' + this.getName() + 'Extension';
};

/**
 * 返回表示此block的nunjucks扩展名
 * @return {Nunjucks.Extension}
 */
TemplateBlock.prototype.toNunjucksExt = function(mainContext, blocksOutput) {
    blocksOutput = blocksOutput || {};

    var that = this;
    var name = this.getName();
    var endTag = this.getEndTag();
    var blocks = this.getBlocks().toJS();

    function Ext() {
        this.tags = [name];

        this.parse = function(parser, nodes) {
            var lastBlockName = null;
            var lastBlockArgs = null;
            var allBlocks = blocks.concat([endTag]);

            // 分析第一个 block
            var tok = parser.nextToken();
            lastBlockArgs = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(tok.value);

            var args = new nodes.NodeList();
            var bodies = [];
            var blockNamesNode = new nodes.Array(tok.lineno, tok.colno);
            var blockArgCounts = new nodes.Array(tok.lineno, tok.colno);

            // 找到 "end<block>" 时分析
            do {
                // Read body
                var currentBody = parser.parseUntilBlocks.apply(parser, allBlocks);

                // 使用以前的block名和参数处理正文
                blockNamesNode.addChild(new nodes.Literal(args.lineno, args.colno, lastBlockName));
                blockArgCounts.addChild(new nodes.Literal(args.lineno, args.colno, lastBlockArgs.children.length));
                bodies.push(currentBody);

                // 将此block的参数作为run函数的参数追加
                lastBlockArgs.children.forEach(function(child) {
                    args.addChild(child);
                });

                // Read new block
                lastBlockName = parser.nextToken().value;

                // 解析签名并移到block的末尾
                if (lastBlockName != endTag) {
                    lastBlockArgs = parser.parseSignature(null, true);
                }

                parser.advanceAfterBlockEnd(lastBlockName);
            } while (lastBlockName != endTag);

            args.addChild(blockNamesNode);
            args.addChild(blockArgCounts);
            args.addChild(new nodes.Literal(args.lineno, args.colno, NODE_ENDARGS));

            return new nodes.CallExtensionAsync(this, 'run', args, bodies);
        };

        this.run = function(context) {
            var fnArgs = Array.prototype.slice.call(arguments, 1);

            var args;
            var blocks = [];
            var bodies = [];
            var blockNames;
            var blockArgCounts;
            var callback;

            // 提取 callback
            callback = fnArgs.pop();

            // 检测参数结尾
            var endArgIndex = fnArgs.indexOf(NODE_ENDARGS);

            // 提取 arguments and bodies
            args = fnArgs.slice(0, endArgIndex);
            bodies = fnArgs.slice(endArgIndex + 1);

            // Extract block counts
            blockArgCounts = args.pop();
            blockNames = args.pop();

            // 重新创建blocks列表
            blockNames.forEach(function(name, i) {
                var countArgs = blockArgCounts[i];
                var blockBody = bodies.shift();

                var blockArgs = countArgs > 0? args.slice(0, countArgs) : [];
                args = args.slice(countArgs);
                var blockKwargs = extractKwargs(blockArgs);

                blocks.push({
                    name: name,
                    body: blockBody(),
                    args: blockArgs,
                    kwargs: blockKwargs
                });
            });

            var mainBlock = blocks.shift();
            mainBlock.blocks = blocks;

            Promise()
            .then(function() {
                var ctx = extend({
                    ctx: context
                }, mainContext || {});

                return that.applyBlock(mainBlock, ctx);
            })
            .then(function(result) {
                return that.blockResultToHtml(result, blocksOutput);
            })
            .nodeify(callback);
        };
    }

    return Ext;
};

/**
 * 将block应用于内容
 * @param {Object} inner
 * @param {Object} context
 * @return {Promise<String>|String}
 */
TemplateBlock.prototype.applyBlock = function(inner, context) {
    var processFn = this.getProcess();

    inner = inner || {};
    inner.args = inner.args || [];
    inner.kwargs = inner.kwargs || {};
    inner.blocks = inner.blocks || [];

    var r = processFn.call(context, inner);

    if (Promise.isPromiseAlike(r)) {
        return r.then(this.normalizeBlockResult.bind(this));
    } else {
        return this.normalizeBlockResult(r);
    }
};

/**
 * 规范化block处理函数的结果
 * @param {Object|String} result
 * @return {Object}
 */
TemplateBlock.prototype.normalizeBlockResult = function(result) {
    if (is.string(result)) {
        result = { body: result };
    }
    result.name = this.getName();

    return result;
};

/**
 * 将block结果转换为HTML
 * @param {Object} result
 * @param {Object} blocksOutput: 存储在此对象中的后期处理blocks
 * @return {String}
 */
TemplateBlock.prototype.blockResultToHtml = function(result, blocksOutput) {
    var indexedKey;
    var toIndex = (!result.parse) || (result.post !== undefined);

    if (toIndex) {
        indexedKey = genKey();
        blocksOutput[indexedKey] = result;
    }

    // Parsable block, just return it
    if (result.parse) {
        return result.body;
    }

    // Return it as a position marker
    return '{{-%' + indexedKey + '%-}}';

};

/**
 * 从函数或对象创建模板block
 * @param {String} blockName
 * @param {Object} block
 * @return {TemplateBlock}
 */
TemplateBlock.create = function(blockName, block) {
    if (is.fn(block)) {
        block = new Immutable.Map({
            process: block
        });
    }

    block = new TemplateBlock(block);
    block = block.set('name', blockName);
    return block;
};

/**
 * 从参数数组中提取kwargs
 * @param {Array} args
 * @return {Object}
 */
function extractKwargs(args) {
    var last = args[args.length - 1];
    return (is.object(last) && last.__keywords)? args.pop() : {};
}

module.exports = TemplateBlock;
