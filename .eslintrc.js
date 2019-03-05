'use strict';

module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'script',
		ecmaVersion: 2015
	},
	plugins: [
		'node'
	],
	extends: [
		'plugin:node/recommended',
		'eslint-config-bbva'
	],
	env: {
		node: true
	},
	overrides: [{
		files: [
			'test/**/*.js'
		],
		excludedFiles: [
			'lib/**'
		],
		env: {
			mocha: true
		}
	}]
};
