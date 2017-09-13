const parse = require('@glimmer/syntax').preprocess;
const TransformDotComponentInvocation = require('ember-template-lint/lib/plugins/transform-dot-component-invocation');
const stripBom = require('strip-bom');
const fs = require('fs');

module.exports = {
	families: {
		components: /pods\/components/,
		helpers: /pods\/helpers/
	},
	defaultFamily: 'application',
	blackList: ['each', 'if', 'unless', 'with']
};
