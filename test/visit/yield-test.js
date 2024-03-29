/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('visit.js', () => {
	describe('yields', () => {
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
				type: 'node',
				isAngleBrackets: false

			}, {
				name: 'my-component',
				type: 'node',
				isAngleBrackets: false,
				components: [{
					isAngleBrackets: false,
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
				isAngleBrackets: false,
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
				isAngleBrackets: false,
				components: [{
					name: 'yield',
					type: 'node',
					isAngleBrackets: false,
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
