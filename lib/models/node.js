'use strict';

/**
 * class to store nodes from the glimmer processor
 *
 * component:
 * {
 *   "name": "component-name",
 *   "as": "context",
 *   "components": [Component, ...]
 * }
 *
 * yield:
 * {
 *   "name": "yield",
 *   "as": "context",
 *   "contextuals": [
 *     [
 *       {
 *         "key": "context name",
 *         "value": "component-name"
 *       },
 *       // ... more keys in the "yield" hash
 *     ],
 *     // ...more "yield" hashes (params)
 *   ]
 * }
 */
module.exports = class Node {
	constructor(node, options = {}) {
		const name = options.getNodeName(node);

		this.type = 'node';
		this.isAngleBrackets = Boolean(node.tag && name);

		// populate component if it has a valid name
		if (name) {
			const contextuals = this._findContextuals(name, node);
			const as = this._findContext(node);

			this.name = name;

			if (contextuals) {
				this.contextuals = contextuals;
			}

			if (as) {
				this.as = as;
			}
		}
	}

	_findContext(node) {
		return this.isAngleBrackets ?
			node.blockParams && node.blockParams[0]
			:
			node.program && node.program.blockParams && node.program.blockParams[0];
	}

	_findContextuals(name, node) {
		let children;

		// if the node is a "yield", try to find if it has contextual components
		if (name === 'yield' && node.params && node.params.length) {
			children = node.params.map(({ hash = {} }) => (hash.pairs || []).map(({ key, value }) => ({
				key,
				value: value.value || (value.params && value.params[0].value) || value.original
			})));
		}

		return children;
	}
};
