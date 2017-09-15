'use strict';

const DEFAULT_CONFIG = require('../defaults');
const Module = require('./module');

/**
 * Class to store component data:
 *
 * {
 *   "components": [
 *     {
 *       "name": "component/helper name",
 *       "components": [...]
 *     }
 *   ],
 *   "contextuals": {
 *     "key": ["possible", "values", ...]
 *   },
 *   "family": "components",
 *   "moduleId": "path/to/component.hbs",
 *   "name": "component"
 * }
 */
module.exports = class Component extends Module {
	constructor(moduleId, components) {
		super(moduleId, components);

		this.family = DEFAULT_CONFIG.FAMILY_KEYS.components;
		this.name = this._findName(moduleId);
		this.contextuals = this._findContextuals(this);
	}

	_findName(moduleId) {
		// check pods convention
		if (/template\.hbs$/.test(moduleId)) {
			return moduleId.replace(/^.+\/(.+)\/template\.hbs$/, '$1');
		}
		// ember way
		return moduleId.replace(/^.+\/(.+)\.hbs$/, '$1');
	}

	_findContextuals(node, dictionary = {}) {
		if (node.name === 'yield' && node.contextuals) {
			// populate contextuals dictionary with the "yield" content
			node.contextuals.forEach((pairs) => {
				/**
				 * components can have the same keys in different "yields", right now override
				 * the keys that are already defined, example:
				 *
				 * {{!component.hbs}}
				 * {{yield (hash item=foo)}}
				 * {{yield (hash item=bar)}}
				 *
				 * dictionary:
				 * {
				 *   "item": "bar" // foo has been overrided
				 * }
				 */
				pairs.forEach(({ key, value }) => (dictionary[key] = [value]));
			});
		} else if (node.components && node.components.length) {
			// loop childs to find "yield"
			node.components.forEach((component, index) => {
				this._findContextuals(component, dictionary);

				// remove "yield" element, we are not going to need it because we are storing its values
				if (component.contextuals && component.contextuals.length) {
					delete node.components[index];
				}
			});
			// clean removed elements filtering the deleted nodes
			node.components = node.components.filter(Boolean);
		}

		return dictionary;
	}
};
