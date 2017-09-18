'use strict';

/* global describe it */
/* eslint no-unusued-expressions: false */
const assert = require('assert');
const expect = require('chai').expect;
const parse = require('../lib/parse');

describe('parsejs', () => {
	describe('#parse()', () => {
		it('should list components', () => {
			const input = {
				default: {
					'path/to/file.hbs': {
						moduleId: 'path/to/file.hbs',
						components: [{
							name: 'foo'
						}, {
							name: 'bar'
						}, {
							name: 'wow'
						}]
					}
				}
			};

			assert.deepEqual(parse(input), {
				default: [{
					moduleId: 'path/to/file.hbs',
					name: 'path/to/file.hbs',
					components: ['foo', 'bar', 'wow']
				}]
			});
		});

		it('should list nested components', () => {
			const input = {
				default: {
					'path/to/file.hbs': {
						moduleId: 'path/to/file.hbs',
						components: [{
							name: 'foo',
							components: [{
								name: 'bar',
								components: [{
									name: 'wow'
								}]
							}]
						}]
					}
				}
			};

			assert.deepEqual(parse(input), {
				default: [{
					moduleId: 'path/to/file.hbs',
					name: 'path/to/file.hbs',
					components: ['wow', 'bar', 'foo']
				}]
			});
		});

		it('should remove duplicated components', () => {
			const input = {
				default: {
					'path/to/file.hbs': {
						moduleId: 'path/to/file.hbs',
						components: [{
							name: 'foo'
						}, {
							name: 'foo'
						}, {
							name: 'foo'
						}]
					}
				}
			};

			assert.deepEqual(parse(input), {
				default: [{
					moduleId: 'path/to/file.hbs',
					name: 'path/to/file.hbs',
					components: ['foo']
				}]
			});
		});

		it('should list components used by other components', () => {
			const input = {
				default: {
					'path/to/file.hbs': {
						moduleId: 'path/to/file.hbs',
						components: [{
							name: 'foo'
						}]
					}
				},
				components: {
					foo: {
						moduleId: 'foo',
						components: [{
							name: 'bar'
						}]
					}
				}
			};

			console.dir(parse(input), { depth: null  })

			assert.deepEqual(parse(input), {
				default: [{
					moduleId: 'path/to/file.hbs',
					name: 'path/to/file.hbs',
					components: ['foo', 'bar']
				}],
				components: [{
					moduleId: 'foo',
					name: 'foo',
					components: ['bar']
				}]
			});
		});
	});
});
