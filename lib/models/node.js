'use strict';

function isComponent(name, whiteList = ['yield']) {
	name = name || '';

	return name.indexOf('.') > -1 || name.indexOf('-') > -1 || whiteList.includes(name);
}

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
module.exports = class Component {
	constructor(node) {
		const name = this._findName(node);

		// populate component if it has a valid name
		if (this._isValid(name)) {
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

	get isValid() {
		return this._isValid(this.name);
	}

	_isValid(name) {
		return isComponent(name);
	}

	_findContext(node) {
		return node.program && node.program.blockParams && node.program.blockParams[0];
	}

	_findName(node) {
		let name;

		if (node.path && node.path.original) {
			name = node.path.original;
			if (!isComponent(name)) {
				if (node.params && node.params.length && node.params[0].type === 'PathExpression') {
					name = node.params[0].original;
				}
				if (!isComponent) {
					name = null;
				}
			}
		}

		return name;
	}

	_findContextuals(name, node) {
		let children;

		// if the node is a "yield", try to find if it has contextual components
		if (name === 'yield' && node.params && node.params.length) {
			children = node.params.map(({ hash }) => hash.pairs.map(({ key, value }) => ({
				key,
				value: value.value || (value.params && value.params[0].value) || value.original
			})));
		}

		return children;
	}
};
