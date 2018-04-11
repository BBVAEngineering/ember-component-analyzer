'use strict';

const walkSync = require('walk-sync');
const path = require('path');
const process = require('./process');
const visit = require('./visit');
const DEFAULT_CONFIG = require('./defaults');
const Component = require('./models/component');
const Module = require('./models/module');
const Dictionary = require('./models/dictionary');
const _ = require('lodash');
const fs = require('fs');

module.exports = class Analyzer {
	constructor(paths, config) {
		if (!paths || !paths.length) {
			throw new Error('No paths detected.');
		}

		this.paths = (Array.isArray(paths) ? paths : [paths]).map((dirPath) => {
			if (dirPath[dirPath.length - 1] !== path.sep) {
				return `${dirPath}${path.sep}`;
			}

			return dirPath;
		});

		this.config = _.mergeWith({}, DEFAULT_CONFIG, config, (objValue, srcValue) => {
			if (_.isArray(objValue)) {
				return objValue.concat(srcValue);
			}
		});

		if (!this.config.getNodeName) {
			throw new Error('You must define a \'getNodeName\' function.');
		}

		if (!this.config.families || !this.config.families.default || !this.config.families.components) {
			throw new Error('The node "families" must contain "components" and "default" attributes.');
		}

		this.errors = [
			/**
			 * error throwed by glimmer
			 */
		];

		this.modules = new Dictionary();
	}

	process() {
		this.paths.reduce((acc, basePath) => {
			const filePaths = walkSync(basePath, { globs: ['**/*.hbs'] })
				.map((filePath) => basePath + filePath);

			// Get all handlebars files.
			return acc.concat(...filePaths);
		}, []).map((filePath) => {
			const rawSource = fs.readFileSync(filePath, { encoding: 'utf8' });

			return process(filePath, rawSource);
		}, []).forEach((result) => {
			if (result && result.fatal && !result.ast) {
				this.errors.push(result);
				return;
			}

			const moduleId = result.moduleId;
			const components = visit(result.ast, this.config);
			const families = Object.keys(this.config.families);
			const family = families.find((ifamily) => this.config.families[ifamily].test(moduleId));

			if (family === DEFAULT_CONFIG.FAMILY_KEYS.components) {
				const component = new Component(moduleId, components);

				this.modules[component.name] = component;
			} else {
				this.modules[moduleId] = new Module(moduleId, family, components);
			}
		});

		/**
		 * replace context names to the real component name:
		 *
		 * {{dropdown.item}} => {{dropdown-container.item}} => {{dropdown-item}}
		 */
		this.modules.replaceContextuals();

		/**
		 * split modules into its families:
		 *
		 * {
		 *   "default": {},
		 *   "components": {}
		 * }
		 */
		const result = Object.keys(this.modules).reduce((acc, moduleId) => {
			const module = this.modules[moduleId];
			const family = module.family || DEFAULT_CONFIG.families.default;

			// create the family if not exist
			if (!acc[family]) {
				acc[family] = {};
			}

			// insert the module
			acc[family][moduleId] = module;

			return acc;
		}, {
			errors: this.errors
		});

		return result;
	}
};
