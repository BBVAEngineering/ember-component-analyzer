/* global describe it */
/* eslint no-unusued-expressions: false */
const assert = require('assert');
const expect = require('chai').expect;
const process = require('../lib/process');
const visit = require('../lib/visit');

describe('visit.js', () => {
	describe('#visit() - object structure', () => {
		it('should create root node', () => {
			const input = process('test', '');
			const result = visit(input.ast);

			expect(result).to.be.empty;
		});
	});
});
