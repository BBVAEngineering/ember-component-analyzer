const _ = require('lodash');

function logNode(title, moduleId, node) {
	console.log(`---------- ${title} ----------`);
	console.log(moduleId);
	console.log(node);
	console.log('------------------------------------');
}

function isComponent(name, whiteList = ['yield']) {
	name = name || '';

	return name.indexOf('.') > -1 || name.indexOf('-') > -1 || whiteList.includes(name);
}

function getComponentName(node) {
	let name;

	if (node.path && node.path.original) {
		name = node.path.original;
		if (!isComponent(name)) {
			if (node.params && node.params.length && node.params[0].type === 'PathExpression') {
				name = node.params[0].original;
			}
			if (!isComponent) {
				name = null;
			}
		}
	}

	return name;
}

function getComponent(node, blackList) {
	let contextuals;
	let name = getComponentName(node);
	const as = node.program && node.program.blockParams && node.program.blockParams[0];

	// remove blacklisted elements
	if (blackList.includes(name) || blackList.includes(node.path && node.path.original)) {
		name = null;
	}

	// if the node is a "yield", try to find if it has contextual components
	if (name === 'yield' && node.params && node.params.length) {
		contextuals = node.params.map(({ hash }) => hash.pairs.map(({ key, value }) => ({
			key,
			value: value.value || (value.params && value.params[0].value) || value.original
		})));
	}

	if (!isComponent(name)) {
		name = null;
	}

	const result = { name };

	if (as) {
		result.as = as;
	}

	if (contextuals) {
		result.contextuals = contextuals;
	}

	return result;
}

function lookupContextuals(node, blackList) {
	const module = getComponent(node, blackList);
	let components = [];
	let deepLookup;

	// check if node has children
	if (node.type === 'ElementNode' && node.children && node.children.length) {
		deepLookup = node.children;
	} else if (node.program && node.program.body && node.program.body.length) {
		deepLookup = node.program.body;
	}

	// if node has chils, try to find other components
	if (deepLookup) {
		components = deepLookup
			.map((child) => lookupContextuals(child, blackList))
			.filter(Boolean);
	}

	// remove non named modules (nodes that has a name that is not a valid for a component or blacklisted ones)
	components = components
		.reduce((acc, component) => {
			// flatten the array, the module name could not be valid but it could have more childs
			if (!component || !component.name) {
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
	const tree = lookupContextuals({
		program: ast
	}, options.blackList || []);

	return tree.components || [];
};
