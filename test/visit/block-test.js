'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('visit.js', () => {
	describe('#visit() - block statements with simple name', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#foo}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});

		it('should not return block statement with simple name and params', () => {
			const input = process('test', '{{#foo bar "wow"}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});

		it('should not return block statement with simple name and hash', () => {
			const input = process('test', '{{#foo bar=wow}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			expect(result).to.be.empty;
		});

		it('should return childs of a block statement with simple name', () => {
			const input = process('test', '{{#foo}}{{my-component}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with simple name and context', () => {
			const input = process('test', '{{#foo}}{{my-component}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with simple name', () => {
			const input = process('test', '{{#foo}}{{my-component}}{{#bar}}{{nested-component}}{{/bar}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node'
			}, {
				name: 'nested-component',
				type: 'node'
			}]);
		});
	});

	describe('#visit() - block statements with complex name', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#my-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should not return block statement with complex name and params', () => {
			const input = process('test', '{{#my-component bar "wow"}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should not return block statement with complex name and hash', () => {
			const input = process('test', '{{#my-component bar=wow}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process('test', '{{#my-component}}{{nested-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node',
				components: [{
					name: 'nested-component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name and context', () => {
			const input = process('test', '{{#my-component as |foo|}}{{nested-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				as: 'foo',
				type: 'node',
				components: [{
					name: 'nested-component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process('test', '{{#my-component}}{{nested-component}}{{#block-component as |foo|}}{{deep-component}}{{/block-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my-component',
				type: 'node',
				components: [{
					name: 'nested-component',
					type: 'node'
				}, {
					name: 'block-component',
					as: 'foo',
					type: 'node',
					components: [{
						name: 'deep-component',
						type: 'node'
					}]
				}]
			}]);
		});
	});

	describe('#visit() - block statements with not notation', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#my.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should not return block statement with not notation and params', () => {
			const input = process('test', '{{#my.component bar "wow"}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should not return block statement with not notation and hash', () => {
			const input = process('test', '{{#my.component bar=wow}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with not notation', () => {
			const input = process('test', '{{#my.component}}{{nested.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my.component',
				type: 'node',
				components: [{
					name: 'nested.component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with not notation and context', () => {
			const input = process('test', '{{#my.component as |foo|}}{{nested.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my.component',
				as: 'foo',
				type: 'node',
				components: [{
					name: 'nested.component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with not notation', () => {
			const input = process('test', '{{#my.component}}{{nested.component}}{{#block.component as |foo|}}{{deep.component}}{{/block.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'my.component',
				type: 'node',
				components: [{
					name: 'nested.component',
					type: 'node'
				}, {
					name: 'block.component',
					as: 'foo',
					type: 'node',
					components: [{
						name: 'deep.component',
						type: 'node'
					}]
				}]
			}]);
		});
	});
});
