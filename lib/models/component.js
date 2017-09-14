const DEFAULT_CONFIG = require('../defaults');
const Module = require('./module');

module.exports = class Component extends Module {
	constructor(moduleId, components) {
		super(moduleId, components);

		this.family = DEFAULT_CONFIG.FAMILY_KEYS.components;
		this.name = this._findName(moduleId);

		const contextuals = this._findContextuals(this);

		if (contextuals) {
			this.contextuals = contextuals;
		}
	}

	_findName(moduleId) {
		if (/template\.hbs$/.test(moduleId)) {
			// pods
			return moduleId.replace(/^.+\/(.+)\/template\.hbs$/, '$1');
		}
		// ember way
		return moduleId.replace(/^.+\/(.+)\.hbs$/, '$1');
	}

	_findContextuals(node, dictionary = {}) {
		if (node.name === 'yield') {
			node.contextuals.forEach((pairs) => {
				pairs.forEach(({ key, value }) => {
					const dValue = dictionary[key];

					if (dValue) {
						dValue.push(value);
					} else {
						dictionary[key] = [value];
					}
				});
			});
		} else if (node.components && node.components.length) {
			const result = [];

			node.components.forEach((component, index) => {
				this._findContextuals(component, dictionary);

				if (component.contextuals && component.contextuals.length) {
					// remove yield
					delete node.components[index];
				}
			});
			// clean removed elements
			node.components = node.components.filter(Boolean);
		}

		return dictionary;
	}
};
