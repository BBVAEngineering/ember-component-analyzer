'use strict';

const assert = require('assert');
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('visit.js', () => {
	describe('#visit() - yields', () => {
		it('should return yield', () => {
			const input = process('test', `
				{{yield}}
				{{#my-component}}
					{{yield}}
				{{/my-component}}
			`);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'yield',
				type: 'node'
			}, {
				name: 'my-component',
				type: 'node',
				components: [{
					name: 'yield',
					type: 'node'
				}]
			}]);
		});

		it('should return contextual components', () => {
			const input = process('test', `
				{{yield (hash foo='bar')  (hash wow='omg')}}
				{{#my-component}}
					{{yield (hash
						foo=(component 'bar')
						wow=true
						yay='omg'
					)}}
				{{/my-component}}
			`);
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'yield',
				type: 'node',
				contextuals: [
					[{
						key: 'foo',
						value: 'bar'
					}],
					[{
						key: 'wow',
						value: 'omg'
					}]
				]
			}, {
				name: 'my-component',
				type: 'node',
				components: [{
					name: 'yield',
					type: 'node',
					contextuals: [
						[{
							key: 'foo',
							value: 'bar'
						}, {
							key: 'wow',
							value: true
						}, {
							key: 'yay',
							value: 'omg'
						}]
					]
				}]
			}]);
		});
	});
});
