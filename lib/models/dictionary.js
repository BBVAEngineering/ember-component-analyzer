'use strict';

/**
 * class to store all the modules found with the Analyzer
 *
 * Module:
 *
 * "path/to/file": {
 *   "components": [
 *     {
 *       "name": "component/helper name",
 *       "components": [...]
 *     }
 *   ],
 *   "family": "default",
 * }
 *
 *
 * Component:
 *
 * "component-name": {
 *   "components": [
 *     {
 *       "name": "component/helper name",
 *       "components": [...]
 *     }
 *   ],
 *   "contextuals": {
 *		"key": ["possible", "values", ...]
 *   },
 *   "family": "components",
 * }
 **/
module.exports = class Dictionary extends Object {
	lookup(path) {
		const parts = path.split('.');

		return parts.reduce((parentName, next) => {
			const parent = this[parentName];

			if (parent && parent.contextuals) {
				const dictionary = parent.contextuals;

				if (dictionary) {
					return dictionary[next];
				}
			}

			return parentName;
		});
	}

	replaceContextuals() {
		Object.keys(this).forEach((moduleId) => {
			const module = this[moduleId];

			if (module.components && module.components.length) {
				module.components.forEach((component) => this._replaceContextuals(component));
			}
		});
	}

	_replaceNodeComponents(node, dictionary) {
		// continue replacing childrens if exists
		if (node.components && node.components.length) {
			const deepDictionary = Object.assign({}, dictionary);

			// populate dictionary if this node has context
			if (node.as) {
				deepDictionary[node.as] = node.name;
			}
			node.components.forEach((component) => this._replaceContextuals(component, deepDictionary));
		}
	}

	_replaceContextuals(node, dictionary = {}) {
		const parts = node.name.split('.');

		if (parts.length > 1) {
			// replace the context by the real component
			const possibleComponent = dictionary[parts[0]];

			if (possibleComponent) {
				parts[0] = possibleComponent;
			}

			// set the new component name
			node.name = parts.join('.');

			// find the new component and replace the name with dot notation by its name
			const resolvedName = this.lookup(node.name);

			if (resolvedName) {
				node.name = resolvedName;
			}
		}

		// continue replacing childrens if exists
		this._replaceNodeComponents(node, dictionary);
	}
};
