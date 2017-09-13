const walkSync = require('walk-sync');
const path = require('path');
const process = require('./process');
const visit = require('./visit');
const DEFAULT_CONFIG = require('./defaults');
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

		this._contextuals = {
			/**
			 * "path/to/file": ["key", "key", ...]
			 */
		};
	}

	lookup(moduleId) {
		const families = Object.keys(this.config.families);
		let module = this.modules[moduleId];

		if (!module) {
			module = {
				components: [],
				family: families.find((family) => this.config.families[family].test(moduleId)) || this.config.defaultFamily
			};
			this.modules[moduleId] = module;
		}

		return module;
	}

	process() {
		this.paths.reduce((acc, basePath) => {
			// Get all handlebars files.
			const files = walkSync(basePath, { globs: ['**/*.hbs'] });
			const pathResults = files.map((file) => {
				const rawSource = fs.readFileSync(basePath + file, { encoding: 'utf8' });

				return process(basePath + file, rawSource);
			});

			return acc.concat(pathResults);
		}, []).forEach((result) => {
			// Format results Array (each result, aka. file, contains an Array of errors in that file).
			const module = this.lookup(result.moduleId);

			if (result && result.fatal && !result.ast) {
				this.errors.push(result);
				return;
			}

			module.components = module.components.concat(...visit(result.ast, this.config));
		});

		return {
			errors: this.errors,
			modules: this.modules
		};
	}
};
