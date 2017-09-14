const DEFAULT_CONFIG = require('../defaults');
const Module = require('./module');

module.exports = class Component extends Module {
	constructor(moduleId, components) {
		super(moduleId, components);

		this.family = DEFAULT_CONFIG.FAMILY_KEYS.components;
		this.contextuals = this._findContextuals(this);
	}

	get name() {
		if (/template\.hbs$/.test(this.moduleId)) {
			// pods
			return this.moduleId.replace(/^.+\/(.+)\/template\.hbs$/, '$1');
		}
		// ember way
		return this.moduleId.replace(/^.+\/(.+)\.hbs$/, '$1');
	}

	addContextual(yieldComponent) {
		this.contextuals.push(yieldComponent);
	}

	_findContextuals(node) {
		if (node.name === 'yield') {
			return node.contextuals;
		}

		if (node.components) {
			let result = [];

			node.components.forEach((component, index) => {
				const contextuals = this._findContextuals(component);

				if (contextuals) {
					result.push(contextuals);
					// remove yield
					node.components[index] = null;
				}
			});
			// clean removed elements
			node.components = node.components.filter(Boolean);

			return result.filter(Boolean);
		}
	}
};
