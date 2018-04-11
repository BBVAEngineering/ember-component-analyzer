'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const Dictionary = require('../lib/models/dictionary');

describe('dictionary.js', () => {
	describe('#constructor()', () => {
		it('should be an object', () => {
			expect(Dictionary.prototype instanceof Object).to.be.true;
		});
	});

	describe('#lookup()', () => {
		const dictionary = new Dictionary();

		dictionary['my-component'] = {
			contextuals: {
				foo: 'foo-component'
			}
		};

		dictionary['foo-component'] = {
			contextuals: {
				bar: 'bar-component'
			}
		};

		it('should return a component given a simple key that not exists', () => {
			const component = dictionary.lookup('any-component');

			assert.equal(component, 'any-component');
		});

		it('should return the component name given a simple key', () => {
			const component = dictionary.lookup('my-component');

			assert.equal(component, 'my-component');
		});

		it('should not return the component name given a complex key that not exists', () => {
			const component = dictionary.lookup('my-component.bar');

			expect(component).to.be.undefined;
		});

		it('should return the component name given a complex key', () => {
			const component = dictionary.lookup('my-component.foo');

			assert.equal(component, 'foo-component');
		});

		it('should not return the component name given a nested key that not exists', () => {
			const component = dictionary.lookup('my-component.bar.wow');

			expect(component).to.be.undefined;
		});

		it('should return the component name given a nested key', () => {
			const component = dictionary.lookup('my-component.foo.bar');

			assert.equal(component, 'bar-component');
		});
	});
});
