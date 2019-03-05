'use strict';

module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'script',
		ecmaVersion: 2017
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
	rules: {
		'no-process-env': 0
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
		},
		rules: {
			'no-unused-expressions': 0
		}
	}]
};
