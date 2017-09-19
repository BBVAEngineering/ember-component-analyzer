require('babel-register');

const Analyzer = require('./lib/analyzer');
const parse = require('./lib/parse');
const defaults = require('./lib/defaults');

module.exports = {
	Analyzer,
	parse,
	defaults
};
