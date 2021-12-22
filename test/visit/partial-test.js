/* eslint-disable node/no-deprecated-api */
'use strict';

const assert = require('assert');
const process = require('../../lib/process');
const visit = require('../../lib/visit');
const DEFAULTS = require('../../lib/defaults');

describe('visit.js', () => {
	describe('partials', () => {
		it('should return partials', () => {
			const input = process('test', '{{partial \'partial/path\'}}');
			const result = visit(input.ast, DEFAULTS);

			assert.deepEqual(result, [{
				name: 'partial/path',
				type: 'partial'
			}]);
		});
	});
});
