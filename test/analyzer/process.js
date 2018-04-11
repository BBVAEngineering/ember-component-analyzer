'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const Analyzer = require('../../lib/analyzer');

describe('analyzer.js', () => {
	describe('#process()', () => {
		it('should return the correct tree', () => {
			const analyzer = new Analyzer('./test/fixtures');
			const expected = JSON.parse(fs.readFileSync(path.resolve('./test/fixtures/expected.json')));
			const result = analyzer.process();

			delete result.errors[0].source;

			assert.deepEqual(result, expected);
		});
	});
});
