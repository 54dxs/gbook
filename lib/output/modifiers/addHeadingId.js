var slug = require('github-slugid');
var editHTMLElement = require('./editHTMLElement');

/**
    想heading添加ID

    @param {HTMLElement} heading
    heading--->initialize {
    	'0': {
    		type: 'tag',
    		name: 'h1',
    		attribs: {},
    		children: [[Object]],
    		next: {
    			data: '\n',
    			type: 'text',
    			next: null,
    			prev: [Circular],
    			parent: null,
    			root: [Object]
    		},
    		prev: null,
    		parent: null,
    		root: {
    			type: 'root',
    			name: 'root',
    			attribs: {},
    			children: [Array],
    			next: null,
    			prev: null,
    			parent: null
    		}
    	},
    	options: {
    		withDomLvl1: true,
    		normalizeWhitespace: false,
    		xmlMode: false,
    		decodeEntities: true
    	},
    	length: 1,
    	_root: [Circular]
    }
*/
function addId(heading) {
    // heading.attr(id)---> undefined
    if (heading.attr('id')) return;
    // heading.text()---> 介绍
    // heading.text()---> 介绍1
    // heading.text()---> 介绍2
    // heading.text()---> 介绍3
    // heading.text()---> 介绍4
    // slug(heading.text())---> 介绍
    // slug(heading.text())---> 介绍1
    // slug(heading.text())---> 介绍2
    // slug(heading.text())---> 介绍3
    // slug(heading.text())---> 介绍4
    heading.attr('id', slug(heading.text()));
}

/**
    向所有heading添加ID

    @param {HTMLDom} $
*/
function addHeadingId($) {
    return editHTMLElement($, 'h1,h2,h3,h4,h5,h6', addId);
}

module.exports = addHeadingId;
