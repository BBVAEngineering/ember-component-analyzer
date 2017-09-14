const DEFAULT_CONFIG = require('../defaults');

module.exports = class Module {
	constructor(moduleId, components = []) {
		this.family = DEFAULT_CONFIG.FAMILY_KEYS.application;
		this.moduleId = moduleId;
		this.components = components;
	}

	get name() {
		return this.moduleId;
	}
};
