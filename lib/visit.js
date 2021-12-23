'use strict';

const _ = require('lodash');
const Node = require('./models/node');
const Partial = require('./models/partial');

function findChildren(node, options) {
	let components = [];
	const deepLookup = nodeChildrens(node);

	// if node has childs, try to find other components
	if (deepLookup) {
		components = deepLookup.map((child) => lookupComponents(child, options));
	}

	if (node.type === 'MustacheStatement' && node.path && node.path.original === 'partial') {
		components.push(
			new Partial(node, options)
		);
	}

	return components;
}

function nodeChildrens(node) {
	const { type, children = [], program, inverse } = node;

	// check if node has children
	if (type === 'ElementNode' && children.length > 0) {
		return children;
	}

	let content = [];

	if (program && program.body && program.body.length) {
		content = [...content, ...program.body];
	}

	if (inverse && inverse.body && inverse.body.length) {
		content = [...content, ...inverse.body];
	}

	return content;
}

function lookupComponents(node, options) {
	const module = new Node(node, options);
	let components = findChildren(node, options);

	// remove non named modules (nodes that has a name that is not a valid for a component or blacklisted ones)
	components = components
		.reduce((acc, component) => {
			// flatten the array, the module name could not be valid but it could have more childs
			if (!component.name) {
				component = component.components;
				if (!component || !component.length) {
					component = null;
				}
			}

			return acc.concat(component);
		}, [])
		.filter(Boolean);

	// flatten the array
	module.components = _.flattenDeep(components);

	if (!module.components.length) {
		delete module.components;
	}

	return module;
}

module.exports = function visit(ast, options = {}) {
	const tree = lookupComponents({
		program: ast
	}, options);

	return (tree.components || []).filter((component) => component.name);
};
