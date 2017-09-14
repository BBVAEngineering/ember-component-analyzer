/* global describe it */
/* eslint no-unusued-expressions: false */
const assert = require('assert');
const expect = require('chai').expect;
const process = require('../lib/process');
const visit = require('../lib/visit');

describe('visit.js', () => {
	describe('#visit() - yields', () => {
		it('should return yield', () => {
			const input = process('test', `
				{{yield}}
				{{#my-component}}
					{{yield}}
				{{/my-component}}
			`);
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'yield'
			}, {
				name: 'my-component',
				components: [{
					name: 'yield'
				}]
			}]);
		});

		it('should return contextual components', () => {
			const input = process('test', `
				{{yield}}
				{{#my-component}}
					{{yield (hash
						foo=(component 'bar')
						wow=true
						yay='omg'
					)}}
				{{/my-component}}
			`);
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'yield'
			}, {
				name: 'my-component',
				components: [{
					name: 'yield',
					contextuals: [{
						key: 'foo',
						value: 'bar'
					}, {
						key: 'wow',
						value: true
					}, {
						key: 'yay',
						value: 'omg'
					}]
				}]
			}]);
		});
	});
});
