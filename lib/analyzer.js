const walkSync = require('walk-sync');
const path = require('path');
const process = require('./process');
const visit = require('./visit');
const DEFAULT_CONFIG = require('./defaults');
const Component = require('./models/component');
const Module = require('./models/module');
const _ = require('lodash');
const fs = require('fs');

module.exports = class Analyzer {
	constructor(paths, config) {
		this.paths = paths.map((dirPath) => {
			if (dirPath[dirPath.length - 1] !== path.sep) {
				return `${dirPath}${path.sep}`;
			}

			return dirPath;
		});

		this.config = _.merge({}, DEFAULT_CONFIG, config);

		if (!this.config.families || !this.config.families.application || !this.config.families.components) {
			throw new Error('The node "families" must contain "components" and "application" attributes.');
		}

		this.errors = [
			/**
			 * error throwed by glimmer
			 */
		];

		this.modules = {
			/**
			 * "path/to/file": {
			 *   "components": [
			 *     {
			 *       "name": "component/helper name",
			 *       "loc": {
			 *         "start": {},
			 *         "end": {}
			 *     }
			 *   ],
			 *   "family": "familyName",
			 * }
			 **/
		};
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
			const family = families.find((family) => this.config.families[family].test(moduleId));

			if (family === DEFAULT_CONFIG.FAMILY_KEYS.components) {
				const component = new Component(moduleId, components);

				this.modules[component.name] = component;
			} else {
				this.modules[moduleId] = new Module(moduleId, components);
			}
		});

		/**
		 * split modules into its families:
		 *
		 * {
		 *   "application": {},
		 *   "components": {}
		 * }
		 */
		const result = Object.keys(this.modules).reduce((acc, moduleId) => {
			const module = this.modules[moduleId];
			const family = module.family || '';

			// create the family if not exist
			if (!acc[family]) {
				acc[family] = {};
			}

			// insert the module
			acc[family][moduleId] = module;

			return acc;
		}, {});

		/**
		 * replace context names to the real component name:
		 *
		 * {{dropdown.item}} => {{dropdown-container.item}} => {{dropdown-item}}
		 */
		function getComponentByPath(cPath) {
			const parts = cPath.split('.');
			const component = this.modules[parts[0]];

			if (!component) {
				return;
			}


		}

		function replaceContextuals(node, dictionary = {}) {
			// console.log(node.name)
			const parts = node.name.split('.');

			if (parts.length > 1) {
				// replace the context by the real component
				const possibleComponent = dictionary[parts[0]];

				if (possibleComponent) {
					parts[0] = possibleComponent;
				}

				// set the new component name
				node.name = parts.join('.');
			}

			// continue replacing childrens if exists
			if (node.components && node.components.length) {
				const deepDictionary = Object.assign({}, dictionary);

				// populate dictionary if this node has context
				if (node.as) {
					deepDictionary[node.as] = node.name;
				}
				// console.log('new dictionary', deepDictionary);
				node.components.forEach((component) => replaceContextuals(component, deepDictionary));
			}
		}

		Object.keys(this.modules).forEach((moduleId) => {
			const module = this.modules[moduleId];

			module.components.forEach(replaceContextuals);
		});

		// append templating errors
		result.errors = this.errors;

		return result;
	}
};
