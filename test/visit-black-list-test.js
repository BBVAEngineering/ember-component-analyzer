/* global describe it */
/* eslint no-unusued-expressions: false */
const assert = require('assert');
const expect = require('chai').expect;
const process = require('../lib/process');
const visit = require('../lib/visit');

describe('visit.js', () => {
	describe('#visit() - discard blackListed elements', () => {
		it('should return the tree excluding each', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#each collection as |item|}}
					{{#my-component as |my|}}
						{{#each model as |data|}}
							{{my.element data=data}}
						{{/each}}
					{{/my-component}}
				{{/each}}
			`);
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component',
				as: 'my',
				components: [{
					name: 'my.element'
				}]
			}]);
		});

		it('should return the tree excluding with', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#with collection as |foo|}}
					{{#my-component as |my|}}
						{{#with foo as |bar|}}
							{{my.element data=bar}}
						{{/with}}
					{{/my-component}}
				{{/with}}
			`);
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component',
				as: 'my',
				components: [{
					name: 'my.element'
				}]
			}]);
		});

		it('should return the tree excluding if', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#if collection}}
					{{#my-component as |my|}}
						{{#if my}}
							{{my.element data=data}}
						{{/if}}
					{{/my-component}}
				{{/if}}
			`);
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component',
				as: 'my',
				components: [{
					name: 'my.element'
				}]
			}]);
		});

		it('should return the tree excluding unless', () => {
			const input = process('test', `
				{{t 'label'}}
				{{#unless collection}}
					{{#my-component as |my|}}
						{{#unless my}}
							{{my.element data=data}}
						{{/unless}}
					{{/my-component}}
				{{/unless}}
			`);
			const result = visit(input.ast);

			assert.deepEqual(result, [{
				name: 'my-component',
				as: 'my',
				components: [{
					name: 'my.element'
				}]
			}]);
		});
	});
});
