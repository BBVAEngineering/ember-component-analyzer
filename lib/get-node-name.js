'use strict';

const dasherize = require('dasherize');

function isValidComponent(name) {
	const whitelist = ['yield'];

	return name.indexOf('.') > -1 || name.indexOf('-') > -1 || name.indexOf('/') > -1 || whitelist.includes(name);
}

const HTML_TAGS = ['a',
	'abbr',
	'acronym',
	'address',
	'applet',
	'area',
	'article',
	'aside',
	'audio',
	'b',
	'base',
	'basefont',
	'bdi',
	'bdo',
	'bgsound',
	'big',
	'blink',
	'blockquote',
	'body',
	'br',
	'button',
	'canvas',
	'caption',
	'center',
	'cite',
	'code',
	'col',
	'colgroup',
	'content',
	'data',
	'datalist',
	'dd',
	'decorator',
	'del',
	'details',
	'dfn',
	'dir',
	'div',
	'dl',
	'dt',
	'element',
	'em',
	'embed',
	'fieldset',
	'figcaption',
	'figure',
	'font',
	'footer',
	'form',
	'frame',
	'frameset',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'head',
	'header',
	'hgroup',
	'hr',
	'html',
	'i',
	'iframe',
	'img',
	'input',
	'ins',
	'isindex',
	'kbd',
	'keygen',
	'label',
	'legend',
	'li',
	'link',
	'listing',
	'main',
	'map',
	'mark',
	'marquee',
	'menu',
	'menuitem',
	'meta',
	'meter',
	'nav',
	'nobr',
	'noframes',
	'noscript',
	'object',
	'ol',
	'optgroup',
	'option',
	'output',
	'p',
	'param',
	'plaintext',
	'pre',
	'progress',
	'q',
	'rp',
	'rt',
	'ruby',
	's',
	'samp',
	'script',
	'section',
	'select',
	'shadow',
	'small',
	'source',
	'spacer',
	'span',
	'strike',
	'strong',
	'style',
	'sub',
	'summary',
	'sup',
	'table',
	'tbody',
	'td',
	'template',
	'textarea',
	'tfoot',
	'th',
	'thead',
	'time',
	'title',
	'tr',
	'track',
	'tt',
	'u',
	'ul',
	'var',
	'video',
	'wbr',
	'xmp'];
const EMBER_HELPERS = ['each', 'if', 'unless', 'with'];
const BLACKLIST = [...HTML_TAGS, ...EMBER_HELPERS];

// eslint-disable-next-line complexity
module.exports = function getNodeName(node) {
	const { path = {}, params = [] } = node || {};
	let name;

	if (path.original) {
		name = path.original;
		if (!isValidComponent(name)) {
			if (params.length && params[0].type === 'PathExpression') {
				name = params[0].original;
			}
			if (!isValidComponent(name)) {
				name = null;
			}
		}
	}

	if (node.tag && !HTML_TAGS.includes(node.tag)) {
		const tag = node.tag.replace('::', '/');

		name = tag.includes('.') ? tag : dasherize(tag).replace('/-', '/');
	}

	// remove blacklisted elements
	if (BLACKLIST.includes(name) || BLACKLIST.includes(path.original)) {
		return null;
	}

	return name;
};
