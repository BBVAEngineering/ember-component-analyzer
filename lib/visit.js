const traverse = require('@glimmer/syntax').traverse;
const _ = require('lodash');

function logNode(title, moduleId, node) {
	console.log(`---------- ${title} ----------`);
	console.log(moduleId);
	console.log(node);
	console.log('------------------------------------');
}

function getComponent(node, blackList) {
	let contextuals;
	let name;

	if (node.type === 'BlockStatement' || node.type === 'MustacheStatement') {
		if (node.params.length && node.params[0].type === 'PathExpression') {
			name = node.params[0].original;
		} else {
			name = node.path.original;
		}
	}

	// remove blacklisted elements
	if (blackList.includes(name)) {
		name = null;
	}

	// if name not exists or not contains "-" (helpers or variables)
	if (name && name.indexOf('-') === -1) {
		// in case of {{yield}}, get possible contextual elements
		if (name === 'yield' && node.params && node.params.length) {
			contextuals = node.params.map(({ hash }) => hash.pairs.map(({ key, value }) => ({
				key,
				value: value.value || (value.params && value.params[0].value) || value.original
			})));
		} else {
			name = null;
		}
	}

	// return component object
	return name ? {
		name,
		as: node.program && node.program.blockParams && node.program.blockParams[0],
		contextuals
	} : null;
}

function lookupContextuals(node, blackList = ['each', 'if', 'unless', 'with', 't']) {
	let components = [];

	if (node.type === 'ElementNode' && node.children && node.children.length) {
		components = node.children
			.map((child) => lookupContextuals(child, blackList))
			.filter(Boolean);
	} else if (node.program && node.program.body && node.program.body.length) {
		components = node.program.body
			.map((child) => lookupContextuals(child, blackList))
			.filter(Boolean);
	} else {
		return getComponent(node, blackList);
	}

	const module = getComponent(node, blackList);

	// return an array to be flattened
	if (blackList.includes(node.path && node.path.original) || !module) {
		return _.flattenDeep(components);
	}

	if (module) {
		module.components = _.flattenDeep(components);
	}

	return module;
}

module.exports = function visit(ast, module) {
	return lookupContextuals({ program: ast, path: { original: 'ast' } });
};
