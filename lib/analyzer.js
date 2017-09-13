const walkSync = require('walk-sync');
const path = require('path');
const processFile = require('./process-file');
const visit = require('./visit');
const DEFAULT_CONFIG = require('./defaults');

module.exports = class Analyzer {
	constructor(paths, config) {
		this.paths = paths.map((dirPath) => {
			if (dirPath[dirPath.length - 1] !== path.sep) {
				return `${dirPath}${path.sep}`;
			}

			return dirPath;
		});

		this.config = Object.assign({}, DEFAULT_CONFIG, config);

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
			const pathResults = files.map((file) => processFile(basePath + file));

			return acc.concat(pathResults);
		}, []).forEach((result) => {
			// Format results Array (each result, aka. file, contains an Array of errors in that file).
			const module = this.lookup(result.moduleId);

			if (result && result.fatal && !result.ast) {
				this.errors.push(result);
				return;
			}

			module.components.push(visit(result.ast));
		});

		return {
			errors: this.errors,
			modules: this.modules
		};
	}
};
