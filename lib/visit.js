const traverse = require('@glimmer/syntax').traverse;
const _ = require('lodash');

function logNode(title, moduleId, node) {
	console.log(`---------- ${title} ----------`);
	console.log(moduleId);
	console.log(node);
	console.log('------------------------------------');
}

function getComponent(node) {
	let name;

	if (node.type === 'BlockStatement' || node.type === 'MustacheStatement') {
		name = (node.params.length && node.params[0].original) || node.path.original;
	}

	return name ? {
		name,
		as: node.program && node.program.blockParams && node.program.blockParams[0]
	} : null;
}

function lookupContextuals(node, disallowed = ['each', 'if', 'unless', 'with']) {
	let components = [];

	if (node.type === 'ElementNode' && node.children && node.children.length) {
		components = node.children
			.map((child) => lookupContextuals(child, disallowed))
			.filter(Boolean);
	} else if (node.program && node.program.body && node.program.body.length) {
		components = node.program.body
			.map((child) => lookupContextuals(child, disallowed))
			.filter(Boolean);
	} else {
		return getComponent(node);
	}

	const module = getComponent(node);

	// return an array to be flattened
	if (disallowed.includes(node.path && node.path.original) || !module) {
		return components;
	}

	if (module) {
		module.components = _.flattenDeep(components);
	}

	return module;
}

module.exports = function visit(ast, module) {
	return lookupContextuals({ program: ast, path: { original: 'ast' } });
};
