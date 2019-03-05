'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const Analyzer = require('../../lib/analyzer');
const DEFAULT_CONFIG = require('../../lib/defaults');

describe('analyzer.js', () => {
	describe('#constructor()', () => {
		it('should throw an error if no path are provided', () => {
			const analizer = () => new Analyzer();

			expect(analizer).to.throw(Error);
		});

		it('should throw an error if no \'getNodeName\' are provided', () => {
			expect(() => new Analyzer('', {})).to.throw(Error);
		});

		it('should throw an error if no valid families are provided', () => {
			const analizer = () => new Analyzer('foo', {
				families: {
					components: null
				}
			});

			expect(analizer).to.throw(Error);
		});

		it('should store default config', () => {
			const analyzer = new Analyzer('foo');

			assert.deepStrictEqual(analyzer.config, DEFAULT_CONFIG);
		});

		it('should extend default config', () => {
			const analyzer = new Analyzer('foo', {
				families: {
					bar: 'wow'
				}
			});

			expect(analyzer.config.families).to.have.deep.property('bar', 'wow');
		});
	});
});
