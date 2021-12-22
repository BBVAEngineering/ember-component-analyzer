/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('visit.js', () => {
	describe('block statements with simple name', () => {
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
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with simple name and context', () => {
			const input = process('test', '{{#foo as |f|}}{{f.myComponent}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'f.myComponent',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with simple name', () => {
			const input = process('test', '{{#foo}}{{my-component}}{{#bar}}{{nested-component}}{{/bar}}{{/foo}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}, {
				isAngleBrackets: false,
				name: 'nested-component',
				type: 'node'
			}]);
		});
	});

	describe('block statements with complex name', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#my-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should not return block statement with complex name and params', () => {
			const input = process('test', '{{#my-component bar "wow"}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should not return block statement with complex name and hash', () => {
			const input = process('test', '{{#my-component bar=wow}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process('test', '{{#my-component}}{{nested-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'nested-component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name and context', () => {
			const input = process('test', '{{#my-component as |foo|}}{{nested-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				as: 'foo',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'nested-component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process('test',
				'{{#my-component}}{{nested-component}}{{#block-component as |foo|}}{{deep-component}}{{/block-component}}{{/my-component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my-component',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'nested-component',
					type: 'node'
				}, {
					isAngleBrackets: false,
					name: 'block-component',
					as: 'foo',
					type: 'node',
					components: [{
						isAngleBrackets: false,
						name: 'deep-component',
						type: 'node'
					}]
				}]
			}]);
		});
	});

	describe('block statements with dot notation', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#my.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should not return block statement with dot notation and params', () => {
			const input = process('test', '{{#my.component bar "wow"}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should not return block statement with dot notation and hash', () => {
			const input = process('test', '{{#my.component bar=wow}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with dot notation', () => {
			const input = process('test', '{{#my.component}}{{nested.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'nested.component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with dot notation and context', () => {
			const input = process('test', '{{#my.component as |foo|}}{{foo.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				as: 'foo',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'foo.component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with dot notation', () => {
			const input = process('test',
				'{{#my.component}}{{nested.component}}{{#block.component as |foo|}}{{deep.component}}{{/block.component}}{{/my.component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my.component',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'nested.component',
					type: 'node'
				}, {
					isAngleBrackets: false,
					name: 'block.component',
					as: 'foo',
					type: 'node',
					components: [{
						isAngleBrackets: false,
						name: 'deep.component',
						type: 'node'
					}]
				}]
			}]);
		});
	});

	describe('block statements with namespace', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '{{#my/component}}{{/my/component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should not return block statement with params', () => {
			const input = process('test', '{{#my/component bar "wow"}}{{/my/component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should not return block statement with hash', () => {
			const input = process('test', '{{#my/component bar=wow}}{{/my/component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement', () => {
			const input = process('test', '{{#my/component}}{{nested/component}}{{/my/component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'nested/component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with context', () => {
			const input = process('test', '{{#my/component as |foo|}}{{foo/component}}{{/my/component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				as: 'foo',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'foo/component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement', () => {
			const input = process('test',
				'{{#my/component}}{{nested/component}}{{#block/component as |foo|}}{{deep/component}}{{/block/component}}{{/my/component}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: false,
				name: 'my/component',
				type: 'node',
				components: [{
					isAngleBrackets: false,
					name: 'nested/component',
					type: 'node'
				}, {
					isAngleBrackets: false,
					name: 'block/component',
					as: 'foo',
					type: 'node',
					components: [{
						isAngleBrackets: false,
						name: 'deep/component',
						type: 'node'
					}]
				}]
			}]);
		});
	});
});
