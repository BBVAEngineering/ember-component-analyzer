'use strict';

function isValidComponent(name) {
	const whitelist = ['yield'];

	return name.indexOf('.') > -1 || name.indexOf('-') > -1 || whitelist.includes(name);
}

module.exports = function getNodeName(node) {
	const { path = {}, params = [] } = node || {};
	const blacklist = ['each', 'if', 'unless', 'with'];
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

	// remove blacklisted elements
	if (blacklist.includes(name) || blacklist.includes(path.original)) {
		return null;
	}

	return name;
};
