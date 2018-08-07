'use strict';

const assert = require('assert');
const parse = require('../lib/parse');

describe('parsejs', () => {
	describe('#parse()', () => {
		it('should list components', () => {
			const input = {
				default: {
					'path/to/file.hbs': {
						moduleId: 'path/to/file.hbs',
						components: [{
							name: 'foo',
							type: 'node'
						}, {
							name: 'bar',
							type: 'node'
						}, {
							name: 'wow',
							type: 'node'
						}]
					}
				}
			};

			assert.deepEqual(parse(input), {
				default: [{
					moduleId: 'path/to/file.hbs',
					name: 'path/to/file.hbs',
					components: [{
						name: 'foo',
						type: 'node'
					}, {
						name: 'bar',
						type: 'node'
					}, {
						name: 'wow',
						type: 'node'
					}]
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
							type: 'node',
							components: [{
								name: 'bar',
								type: 'node',
								components: [{
									name: 'wow',
									type: 'node'
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
					components: [{
						name: 'wow',
						type: 'node'
					}, {
						name: 'bar',
						type: 'node'
					}, {
						name: 'foo',
						type: 'node'
					}]
				}]
			});
		});

		it('should remove duplicated components', () => {
			const input = {
				default: {
					'path/to/file.hbs': {
						moduleId: 'path/to/file.hbs',
						components: [{
							name: 'foo',
							type: 'node'
						}, {
							name: 'foo',
							type: 'node'
						}, {
							name: 'foo',
							type: 'node'
						}]
					}
				}
			};

			assert.deepEqual(parse(input), {
				default: [{
					moduleId: 'path/to/file.hbs',
					name: 'path/to/file.hbs',
					components: [{
						name: 'foo',
						type: 'node'
					}]
				}]
			});
		});

		it('should list components used by other components', () => {
			const input = {
				default: {
					'path/to/file.hbs': {
						moduleId: 'path/to/file.hbs',
						components: [{
							name: 'foo',
							type: 'node'
						}]
					}
				},
				components: {
					foo: {
						moduleId: 'foo',
						components: [{
							name: 'bar',
							type: 'node'
						}]
					}
				}
			};

			assert.deepEqual(parse(input), {
				default: [{
					moduleId: 'path/to/file.hbs',
					name: 'path/to/file.hbs',
					components: [{
						name: 'foo',
						type: 'node'
					}, {
						name: 'bar',
						type: 'node'
					}]
				}],
				components: [{
					moduleId: 'foo',
					name: 'foo',
					components: [{
						name: 'bar',
						type: 'node'
					}]
				}]
			});
		});
	});
});
