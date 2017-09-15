require('babel-register');

const Analyzer = require('./lib/analyzer');
const parse = require('./lib/parse');

module.exports = {
	Analyzer,
	parse
};
