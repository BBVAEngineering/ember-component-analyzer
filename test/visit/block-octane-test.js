/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('[Octane] visit.js', () => {
	describe('block statements with simple name', () => {
		it('should return block statement with simple name', () => {
			const input = process('test', '<Foo></Foo>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [
				{
					isAngleBrackets: true,
					name: 'foo',
					type: 'node'
				}
			]);
		});

		it('should return block statement with simple name and hash', () => {
			const input = process('test', '<Foo @bar=wow></Foo>');
			const result = visit(input.ast, DEFAULTS);


			assert.deepEqual(result, [
				{
					isAngleBrackets: true,
					name: 'foo',
					type: 'node'
				}
			]);
		});

		it('should return childs of a block statement with simple name', () => {
			const input = process('test', '<Foo><MyComponent /></Foo>');
			const result = visit(input.ast, DEFAULTS);


			assert.deepEqual(result, [
				{
					components: [
						{
							isAngleBrackets: true,
							name: 'my-component',
							type: 'node'
						}
					],
					isAngleBrackets: true,
					name: 'foo',
					type: 'node'
				}
			]);
		});

		it('should return childs of a block statement with simple name and context', () => {
			const input = process('test', '<Foo as |f|><f.myComponent /></Foo>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [
				{
					components: [
						{
							isAngleBrackets: true,
							name: 'f.myComponent',
							type: 'node'
						}
					],
					isAngleBrackets: true,
					name: 'foo',
					type: 'node',
					as: 'f'
				}
			]);
		});

		it('should return childs of a block statement with simple name', () => {
			const input = process('test', '<Foo><MyComponent /><Bar><NestedComponent /></Bar></Foo>');
			const result = visit(input.ast, DEFAULTS);


			assert.deepEqual(result, [
				{
					components: [
						{
							isAngleBrackets: true,
							name: 'my-component',
							type: 'node'
						}, {
							isAngleBrackets: true,
							name: 'bar',
							type: 'node',
							components: [{
								isAngleBrackets: true,
								name: 'nested-component',
								type: 'node'
							}]
						}
					],
					isAngleBrackets: true,
					name: 'foo',
					type: 'node'
				}
			]);
		});
	});

	describe('block statements with complex name', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '<MyComponent></MyComponent>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should not return block statement with complex name and hash', () => {
			const input = process('test', '<MyComponent @bar=wow></MyComponent>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process('test', '<MyComponent><NestedComponent /></MyComponent>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'nested-component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name and context', () => {
			const input = process('test', '<MyComponent as |foo|><NestedComponent /></MyComponent>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				as: 'foo',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'nested-component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with complex name', () => {
			const input = process(
				'test',
				'<MyComponent><NestedComponent /><BlockComponent as |foo|><DeepComponent /></BlockComponent></MyComponent>'
			);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'nested-component',
					type: 'node'
				}, {
					isAngleBrackets: true,
					name: 'block-component',
					as: 'foo',
					type: 'node',
					components: [{
						isAngleBrackets: true,
						name: 'deep-component',
						type: 'node'
					}]
				}]
			}]);
		});
	});

	describe('block statements with not notation', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '<my.component></my.component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should not return block statement with not notation and hash', () => {
			const input = process('test', '<my.component @bar=wow></my.component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my.component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement with not notation', () => {
			const input = process('test', '<my.component><nested.component /></my.component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my.component',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'nested.component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with not notation and context', () => {
			const input = process('test', '<my.component as |foo|><foo.component /></my.component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my.component',
				as: 'foo',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'foo.component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with not notation', () => {
			const input = process(
				'test',
				'<my.component><nested.component /><block.component as |foo|><deep.component /></block.component></my.component>'
			);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my.component',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'nested.component',
					type: 'node'
				}, {
					isAngleBrackets: true,
					name: 'block.component',
					as: 'foo',
					type: 'node',
					components: [{
						isAngleBrackets: true,
						name: 'deep.component',
						type: 'node'
					}]
				}]
			}]);
		});
	});


	describe('block statements with namespace', () => {
		it('should not return block statement with simple name', () => {
			const input = process('test', '<My::Component></My::Component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should not return block statement with hash', () => {
			const input = process('test', '<My::Component @bar=wow></My::Component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/component',
				type: 'node'
			}]);
		});

		it('should return childs of a block statement', () => {
			const input = process('test', '<My::Component><Nested::Component /></My::Component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/component',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'nested/component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement with context', () => {
			const input = process('test', '<My::Component as |foo|><Foo::Component /></My::Component>');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/component',
				as: 'foo',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'foo/component',
					type: 'node'
				}]
			}]);
		});

		it('should return childs of a block statement', () => {
			const input = process(
				'test',
				'<My::Component><Nested::Component /><Block::Component as |foo|><Deep::Component /></Block::Component></My::Component>'
			);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my/component',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'nested/component',
					type: 'node'
				}, {
					isAngleBrackets: true,
					name: 'block/component',
					as: 'foo',
					type: 'node',
					components: [{
						isAngleBrackets: true,
						name: 'deep/component',
						type: 'node'
					}]
				}]
			}]);
		});
	});
});
