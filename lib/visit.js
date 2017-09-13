const _ = require('lodash');

function logNode(title, moduleId, node) {
	console.log(`---------- ${title} ----------`);
	console.log(moduleId);
	console.log(node);
	console.log('------------------------------------');
}

function isComponent(name) {
	name = name || '';

	return name.indexOf('.') > -1 || name.indexOf('-') > -1;
}

function getComponentName(node) {
	let name;

	if (node.path && node.path.original) {
		name = node.path.original;
		if (!isComponent(name)) {
			if (node.params && node.params.length && node.params[0].type === 'PathExpression') {
				name = node.params[0].original;
			}
		}
	}

	// if (node.path && node.path.type === 'PathExpression') {
	// 	name = node.path.original;
	// } else if (node.type === 'BlockStatement' || node.type === 'MustacheStatement') {
		// if (node.params && node.params.length && node.params[0].type === 'PathExpression') {
		// 	name = node.params[0].original;
		// }if (node.path) {
		// 	name = node.path.original;
		// }
	// }

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

	// if name not exists or not contains "-" (helpers or variables)
	// if (!isComponent(name)) {
		// in case of {{yield}}, get possible contextual elements
		if (name === 'yield' && node.params && node.params.length) {
			contextuals = node.params.map(({ hash }) => hash.pairs.map(({ key, value }) => ({
				key,
				value: value.value || (value.params && value.params[0].value) || value.original
			})));
		}
	// }

	// if(name && name.indexOf('.') === -1 && name.indexOf('-') === -1) {
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

	// return component object
	return result;
}

function lookupContextuals(node, blackList) {
	let components = [];

	if (node.type === 'ElementNode' && node.children && node.children.length) {
		components = node.children
			.map((child) => lookupContextuals(child, blackList))
			.filter(Boolean);
	} else if (node.program && node.program.body && node.program.body.length) {
		components = node.program.body
			.map((child) => lookupContextuals(child, blackList))
			.filter(Boolean);
	}

	const module = getComponent(node, blackList);

	components = components
		.reduce((acc, component) => {
			if (!component || !component.name) {
				component = component.components || [];
				if (!component.length) {
					component = null;
				}
			}
			acc.push(component);

			return acc;
		}, [])
		.filter(Boolean);

	module.components = _.flattenDeep(components);

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
