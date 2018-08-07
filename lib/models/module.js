'use strict';

const DEFAULT_CONFIG = require('../defaults');

/**
 * Class to store template file data:
 *
 * {
 *   "components": [
 *     {
 *       "name": "component/helper name",
 *       "components": [...]
 *     }
 *   ],
 *   "family": "default",
 *   "moduleId": "path/to/file.hbs",
 *   "name": "path/to/file.hbs"
 * }
 */
module.exports = class Module {
	constructor(moduleId, family = DEFAULT_CONFIG.FAMILY_KEYS.default, components = []) {
		this.family = family;
		this.moduleId = moduleId;
		this.name = moduleId;
		this.components = components;
	}
};
