var Promise = require('../utils/promise');
var timing = require('../utils/timing');
var Book = require('../models/book');

var parseIgnore = require('./parseIgnore');
var parseConfig = require('./parseConfig');
var parseGlossary = require('./parseGlossary');
var parseSummary = require('./parseSummary');
var parseReadme = require('./parseReadme');
var parseLanguages = require('./parseLanguages');

/**
    分析书的内容

    @param {Book} book
    @return {Promise<Book>}
*/
function parseBookContent(book) {
    return Promise(book)
        .then(parseReadme)
        .then(parseSummary)
        .then(parseGlossary);
}

/**
    Parse a multilingual book

    @param {Book} book
    @return {Promise<Book>}
*/
function parseMultilingualBook(book) {
    var languages = book.getLanguages();
    var langList = languages.getList();

    return Promise.reduce(langList, function(currentBook, lang) {
        var langID = lang.getID();
        var child = Book.createFromParent(currentBook, langID);
        var ignore = currentBook.getIgnore();

        return Promise(child)
        .then(parseConfig)
        .then(parseBookContent)
        .then(function(result) {
            // Ignore content of this book when generating parent book
            ignore = ignore.add(langID + '/**');
            currentBook = currentBook.set('ignore', ignore);

            return currentBook.addLanguageBook(langID, result);
        });
    }, book);
}


/**
    从文件系统解析整本书

    @param {Book} book
    @return {Promise<Book>}
*/
function parseBook(book) {
    return timing.measure(
        'parse.book',
        Promise(book)
        .then(parseIgnore)
        .then(parseConfig)
        .then(parseLanguages)
        .then(function(resultBook) {
            if (resultBook.isMultilingual()) {
                return parseMultilingualBook(resultBook);
            } else {
                return parseBookContent(resultBook);
            }
        })
    );
}

module.exports = parseBook;
