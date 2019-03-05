/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const Analyzer = require('../../lib/analyzer');
const util = require('util');
const readFile = util.promisify(fs.readFile);

describe('analyzer.js', () => {
	describe('#process()', () => {
		it('should return the correct tree', async() => {
			const analyzer = new Analyzer('./test/fixtures');
			const expected = JSON.parse(await readFile(path.resolve('./test/fixtures/expected.json')));
			const result = analyzer.process();

			delete result.errors[0].source;

			assert.deepEqual(result, expected);
		});
	});
});
