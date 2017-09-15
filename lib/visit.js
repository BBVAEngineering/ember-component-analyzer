'use strict';

const _ = require('lodash');
const Node = require('./models/node');

function getComponent(node, blackList) {
	let component = new Node(node);

	// remove blacklisted elements
	if (blackList.includes(component.name) || blackList.includes(node.path && node.path.original)) {
		component = {};
	}

	return component;
}

function lookupComponents(node, blackList) {
	const module = getComponent(node, blackList);
	let components = [];
	let deepLookup;

	// check if node has children
	if (node.type === 'ElementNode' && node.children && node.children.length) {
		deepLookup = node.children;
	} else {
		if (node.program && node.program.body && node.program.body.length) {
			deepLookup = node.program.body;
		}
		if (node.inverse && node.inverse.body && node.inverse.body.length) {
			deepLookup = (deepLookup || []).concat(...node.inverse.body);
		}
	}

	// if node has chils, try to find other components
	if (deepLookup) {
		components = deepLookup
			.map((child) => lookupComponents(child, blackList))
			.filter(Boolean);
	}

	// remove non named modules (nodes that has a name that is not a valid for a component or blacklisted ones)
	components = components
		.reduce((acc, component) => {
			// flatten the array, the module name could not be valid but it could have more childs
			if (!component.isValid) {
				component = component.components || [];
				if (!component.length) {
					component = null;
				}
			}

			return acc.concat(component);
		}, [])
		.filter(Boolean);

	// flatten the array
	module.components = _.flattenDeep(components);

	// remove unneccesary nodes
	if (!module.components.length) {
		delete module.components;
	}

	return module;
}

module.exports = function visit(ast, options = {}) {
	const tree = lookupComponents({
		program: ast
	}, options.blackList || []);

	return tree.components || [];
};
