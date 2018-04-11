'use strict';

module.exports = {
	root: true,
	parser: 'babel-eslint',
	extends: 'eslint-config-bbva',
	env: {
		node: true,
		mocha: true
	},
	rules: {
		'no-sync': 0
	}
}
