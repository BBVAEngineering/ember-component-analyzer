'use strict';

/* global describe it */
/* eslint no-unusued-expressions: false */
const assert = require('assert');
const expect = require('chai').expect;
const process = require('../../lib/process');
const visit = require('../../lib/visit');

describe('visit.js', () => {
	describe('#visit() - block statements with simple name', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#foo}}{{/foo}}');
			const result = visit(input.ast);

			expect(result).to.be.empty;
		});

		it('should not return block statement with simple name and params', () => {
			const input = process('test', '{{#foo bar "wow"}}{{/foo}}');
			const result = visit(input.ast);

			expect(result).to.be.empty;
		});

		it('should not return block statement with simple name and hash', () => {
			const input = process('test', '{{#foo bar=wow}}{{/foo}}');
			const result = visit(input.ast);

			expect(result).to.be.empty;
		});

		it('should return childs of a block statement with simple name', () => {
			const input = process('test', '{{#foo}}{{my-component}}{{/foo}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component'
			}]);
		});

		it('should return childs of a block statement with simple name and context', () => {
			const input = process('test', '{{#foo}}{{my-component}}{{/foo}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component'
			}]);
		});

		it('should return childs of a block statement with simple name', () => {
			const input = process('test', '{{#foo}}{{my-component}}{{#bar}}{{nested-component}}{{/bar}}{{/foo}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component'
			}, {
				name: 'nested-component'
			}]);
		});
	});

	describe('#visit() - block statements with complex name', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#my-component}}{{/my-component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component'
			}]);
		});

		it('should not return block statement with complex name and params', () => {
			const input = process('test', '{{#my-component bar "wow"}}{{/my-component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component'
			}]);
		});

		it('should not return block statement with complex name and hash', () => {
			const input = process('test', '{{#my-component bar=wow}}{{/my-component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component'
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process('test', '{{#my-component}}{{nested-component}}{{/my-component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component',
				components: [{
					name: 'nested-component'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name and context', () => {
			const input = process('test', '{{#my-component as |foo|}}{{nested-component}}{{/my-component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component',
				as: 'foo',
				components: [{
					name: 'nested-component'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process('test', '{{#my-component}}{{nested-component}}{{#block-component as |foo|}}{{deep-component}}{{/block-component}}{{/my-component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component',
				components: [{
					name: 'nested-component'
				}, {
					name: 'block-component',
					as: 'foo',
					components: [{
						name: 'deep-component'
					}]
				}]
			}]);
		});
	});

	describe('#visit() - block statements with not notation', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#my.component}}{{/my.component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my.component'
			}]);
		});

		it('should not return block statement with not notation and params', () => {
			const input = process('test', '{{#my.component bar "wow"}}{{/my.component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my.component'
			}]);
		});

		it('should not return block statement with not notation and hash', () => {
			const input = process('test', '{{#my.component bar=wow}}{{/my.component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my.component'
			}]);
		});

		it('should return childs of a block statement with not notation', () => {
			const input = process('test', '{{#my.component}}{{nested.component}}{{/my.component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my.component',
				components: [{
					name: 'nested.component'
				}]
			}]);
		});

		it('should return childs of a block statement with not notation and context', () => {
			const input = process('test', '{{#my.component as |foo|}}{{nested.component}}{{/my.component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my.component',
				as: 'foo',
				components: [{
					name: 'nested.component'
				}]
			}]);
		});

		it('should return childs of a block statement with not notation', () => {
			const input = process('test', '{{#my.component}}{{nested.component}}{{#block.component as |foo|}}{{deep.component}}{{/block.component}}{{/my.component}}');
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my.component',
				components: [{
					name: 'nested.component'
				}, {
					name: 'block.component',
					as: 'foo',
					components: [{
						name: 'deep.component'
					}]
				}]
			}]);
		});
	});

});
