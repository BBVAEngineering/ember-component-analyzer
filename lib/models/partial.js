'use strict';

/**
 * class to store partials from the glimmer processor
 *
 * partial:
 * {
 *   "name": "partial-name",
 *   "components": [Component, ...]
 * }
 */
module.exports = class Partial {
	constructor(node) {
		const name = node.params[0].original;

		this.type = 'partial';

		if (name) {
			this.name = name;
			this.components = [];
		}
	}
};
