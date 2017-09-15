/* global describe it */
/* eslint no-unusued-expressions: false */
const assert = require('assert');
const expect = require('chai').expect;
const Analyzer = require('../../lib/analyzer');
const DEFAULT_CONFIG = require('../../lib/defaults');

describe('analyzer.js', () => {
	describe('#constructor()', () => {
		it('should throw an error if no path are provided', () => {
			expect(() => new Analyzer()).to.throw(Error);
		});

		it('should throw an error if no valid families are provided', () => {
			expect(() => new Analyzer('foo', {
				families: {
					components: null
				}
			})).to.throw(Error);
		});

		it('should store default config', () => {
			const analyzer = new Analyzer('foo');

			assert.deepEqual(analyzer.config, DEFAULT_CONFIG);
		});

		it('should extend default config', () => {
			const analyzer = new Analyzer('foo', {
				blackList: ['foo'],
				families: {
					bar: 'wow'
				}
			});

			expect(analyzer.config).to.have.nested.property('blackList.[4]', 'foo');
			expect(analyzer.config.families).to.have.deep.property('bar', 'wow');
		});
	});
});
