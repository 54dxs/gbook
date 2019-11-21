var Immutable = require('immutable');

var error = require('../utils/error');
var File = require('./file');
var GlossaryEntry = require('./glossaryEntry');
var parsers = require('../parsers');

var Glossary = Immutable.Record({
    file:       File(),
    entries:    Immutable.OrderedMap()
});

Glossary.prototype.getFile = function() {
    return this.get('file');
};

Glossary.prototype.getEntries = function() {
    return this.get('entries');
};

/**
 * 根据its的名字得到一个实例
 * @param {String} name
 * @return {GlossaryEntry}
 */
Glossary.prototype.getEntry = function(name) {
    var entries = this.getEntries();
    var id = GlossaryEntry.nameToID(name);

    return entries.get(id);
};

/**
 * 将词汇表呈现为文本
 * @param {Object} parser
 * @return {Promise<String>}
 */
Glossary.prototype.toText = function(parser) {
    var file = this.getFile();
    var entries = this.getEntries();

    parser = parser? parsers.getByExt(parser) : file.getParser();

    if (!parser) {
        throw error.FileNotParsableError({
            filename: file.getPath()
        });
    }

    return parser.renderGlossary(entries.toJS());
};

/**
 * 添加/替换一个实例到glossary
 * @param {Glossary} glossary
 * @param {GlossaryEntry} entry
 * @return {Glossary}
 */
Glossary.addEntry = function addEntry(glossary, entry) {
    var id = entry.getID();
    var entries = glossary.getEntries();

    entries = entries.set(id, entry);
    return glossary.set('entries', entries);
};

/**
 * 按名称/说明向词汇表添加/替换实例
 * @param {Glossary} glossary
 * @param {GlossaryEntry} name
 * @param {Object} description
 * @return {Glossary}
 */
Glossary.addEntryByName = function addEntryByName(glossary, name, description) {
    var entry = new GlossaryEntry({
        name: name,
        description: description
    });

    return Glossary.addEntry(glossary, entry);
};

/**
 * 从实例列表创建词汇表
 * @param {String} file
 * @param {Array|List} entries
 * @return {Glossary}
 */
Glossary.createFromEntries = function createFromEntries(file, entries) {
    entries = entries.map(function(entry) {
        if (!(entry instanceof GlossaryEntry)) {
            entry = new GlossaryEntry(entry);
        }

        return [entry.getID(), entry];
    });

    return new Glossary({
        file: file,
        entries: Immutable.OrderedMap(entries)
    });
};


module.exports = Glossary;
