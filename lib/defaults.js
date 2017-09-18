'use strict';

const FAMILY_KEYS = {
	components: 'components',
	default: 'default'
};

module.exports = {
	FAMILY_KEYS,

	families: {
		[FAMILY_KEYS.components]: /components/,
		[FAMILY_KEYS.default]: /^((?!components).)*$/
	},

	getNodeName: require('./get-node-name')
};
