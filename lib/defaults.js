'use strict';

const FAMILY_KEYS = {
	components: 'components',
	application: 'application'
};

module.exports = {
	FAMILY_KEYS,
	families: {
		[FAMILY_KEYS.components]: /components/,
		[FAMILY_KEYS.application]: /^((?!components).)*$/
	},
	blackList: ['each', 'if', 'unless', 'with']
};
