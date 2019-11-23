var Immutable = require('immutable');
var slug = require('github-slugid');

/**
 * A definition represents an entry in the glossary
*/
var GlossaryEntry = Immutable.Record({
    name:               String(),
    description:        String()
});

GlossaryEntry.prototype.getName = function() {
    return this.get('name');
};

GlossaryEntry.prototype.getDescription = function() {
    return this.get('description');
};

/**
 * 获取这个实例的ID值
 * @retrun {Boolean}
 */
GlossaryEntry.prototype.getID = function() {
    return GlossaryEntry.nameToID(this.getName());
};

/**
 * 将词汇表条目名称规范化为唯一的id
 * @param {String} name
 * @return {String}
 */
GlossaryEntry.nameToID = function nameToID(name) {
    return slug(name);
};

module.exports = GlossaryEntry;
