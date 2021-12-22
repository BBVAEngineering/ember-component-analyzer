/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('[Octane] visit.js', () => {
	describe('discard blackListed elements', () => {
		it('should return the tree excluding each', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#each collection as |item|}}
					<MyComponent as |my|>
						{{#each model as |data|}}
							<my.element data=data />
						{{/each}}
					</MyComponent>
				{{/each}}
			`);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				as: 'my',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'my.element',
					type: 'node'
				}]
			}]);
		});

		it('should return the tree excluding with', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#with collection as |foo|}}
					<MyComponent as |my|>
						{{#with foo as |bar|}}
							<my.element data=data />
						{{/with}}
					</MyComponent>
				{{/with}}
			`);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				as: 'my',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'my.element',
					type: 'node'
				}]
			}]);
		});

		it('should return the tree excluding if', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#if collection}}
					<MyComponent as |my|>
						{{#if my}}
							<my.element data=data />
						{{/if}}
					</MyComponent>
				{{/if}}
			`);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				as: 'my',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'my.element',
					type: 'node'
				}]
			}]);
		});

		it('should return the tree excluding unless', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#unless collection}}
					<MyComponent as |my|>
						{{#unless my}}
							<my.element data=data />
						{{/unless}}
					</MyComponent>
				{{/unless}}
			`);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				isAngleBrackets: true,
				name: 'my-component',
				as: 'my',
				type: 'node',
				components: [{
					isAngleBrackets: true,
					name: 'my.element',
					type: 'node'
				}]
			}]);
		});
	});
});
