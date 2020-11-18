'use strict';

const parse = require('@glimmer/syntax').preprocess;
const stripBom = require('strip-bom');

module.exports = function process(moduleId, rawSource) {
	let result;

	rawSource = stripBom(rawSource);

	try {
		const ast = parse(rawSource, {
			moduleId,
			rawSource
		});

		result = {
			ast,
			moduleId
		};
	} catch (error) {
		result = {
			fatal: true,
			moduleId,
			message: error.message,
			source: error.stack,
			severity: 2
		};
	}

	return result;
};
