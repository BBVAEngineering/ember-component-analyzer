/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('visit.js', () => {
	describe('inline statements', () => {
		it('should not return inline statement with simple name', () => {
			const input = process('test', '{{foo}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});

		it('should not return inline statement with simple name and params', () => {
			const input = process('test', '{{foo bar "wow"}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});

		it('should not return inline statement with simple name and hash', () => {
			const input = process('test', '{{foo bar=wow}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});

		it('should not return inline statement with simple name and context', () => {
			const input = process('test', '{{foo as |bar|}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});
	});

	describe('inline statements with dot notation', () => {
		it('should return inline statement with complex name', () => {
			const input = process('test', '{{my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and params', () => {
			const input = process('test', '{{my.component bar "wow"}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and hash', () => {
			const input = process('test', '{{my.component bar=wow}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should not return inline statement with complex name and context', () => {
			const input = process('test', '{{my.component as |bar|}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});
	});

	describe('inline statements with dash notation', () => {
		it('should return inline statement with complex name', () => {
			const input = process('test', '{{my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and hash', () => {
			const input = process('test', '{{my-component bar "wow"}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and hash', () => {
			const input = process('test', '{{my-component bar=wow}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should not return inline statement with complex name and context', () => {
			const input = process('test', '{{my-component as |bar|}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});
	});

	describe('inline statements with dash notation and namespace', () => {
		it('should return inline statement with complex name', () => {
			const input = process('test', '{{my/component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and hash', () => {
			const input = process('test', '{{my/component bar "wow"}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and hash', () => {
			const input = process('test', '{{my/component bar=wow}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should not return inline statement with complex name and context', () => {
			const input = process('test', '{{my/component as |bar|}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});
	});
});
