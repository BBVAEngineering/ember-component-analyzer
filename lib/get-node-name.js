'use strict';

function isValidComponent(name) {
	const whitelist = ['yield'];

	return name.indexOf('.') > -1 || name.indexOf('-') > -1 || whitelist.includes(name);
}

module.exports = function getNodeName(node) {
	const blacklist = ['each', 'if', 'unless', 'with'];
	let name;

	if (node.path && node.path.original) {
		name = node.path.original;
		if (!isValidComponent(name)) {
			if (node.params && node.params.length && node.params[0].type === 'PathExpression') {
				name = node.params[0].original;
			}
			if (!isValidComponent(name)) {
				name = null;
			}
		}
	}

	// remove blacklisted elements
	if (blacklist.includes(name) || blacklist.includes(node && node.path && node.path.original)) {
		return null;
	}

	return name;
};
