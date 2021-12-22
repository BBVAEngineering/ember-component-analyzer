/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('[Octane] visit.js', () => {
	describe('inline statements', () => {
		it('should return inline statement with simple name', () => {
			const input = process('test', '<Foo />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'foo',
				type: 'node'
			}]);
		});

		it('should return inline statement with simple name and hash', () => {
			const input = process('test', '<Foo @bar=wow />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'foo',
				type: 'node'
			}]);
		});

		it('should return inline statement with simple name and context', () => {
			const input = process('test', '<Foo as |bar| />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				as: 'bar',
				name: 'foo',
				type: 'node'
			}]);
		});
	});

	describe('inline statements with dot notation', () => {
		it('should return inline statement with complex name', () => {
			const input = process('test', '<my.component />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and hash', () => {
			const input = process('test', '<my.component @bar=wow />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should not return inline statement with complex name and context', () => {
			const input = process('test', '<my.component as |bar| />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				as: 'bar',
				name: 'my.component',
				type: 'node'
			}]);
		});
	});

	describe('inline statements with namespace', () => {
		it('should return inline statement with complex name', () => {
			const input = process('test', '<My::FooComponent />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/foo-component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name', () => {
			const input = process('test', '<My::Component />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should return inline statement with complex name and hash', () => {
			const input = process('test', '<My::Component @bar=wow />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should not return inline statement with complex name and context', () => {
			const input = process('test', '<My::Component as |bar| />');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				as: 'bar',
				name: 'my/component',
				type: 'node'
			}]);
		});
	});
});
