const parse = require('@glimmer/syntax').preprocess;
const TransformDotComponentInvocation = require('ember-template-lint/lib/plugins/transform-dot-component-invocation');
const stripBom = require('strip-bom');
const fs = require('fs');
const DEFAULT_CONFIG = require('./defaults');

module.exports = function processFile(filePath) {
	const template = stripBom(fs.readFileSync(filePath, { encoding: 'utf8' }));
	let result;

	try {
		const ast = parse(template, {
			moduleName: filePath,
			rawSource: template,
			plugins: {
				ast: [TransformDotComponentInvocation]
			}
		});

		result = {
			ast,
			moduleId: filePath
		};
	} catch (error) {
		result = {
			fatal: true,
			moduleId: filePath,
			message: error.message,
			source: error.stack,
			severity: 2
		};
	}

	return result;
};
