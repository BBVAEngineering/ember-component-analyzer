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
	}

	lookup(moduleId) {
		let module = this.modules[moduleId];

		if (!module) {
			const families = Object.keys(this.config.families);

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
			const filePaths = walkSync(basePath, { globs: ['**/*.hbs'] }).map((filePath) => basePath + filePath);

			// Get all handlebars files.
			return acc.concat(...filePaths);
		}, []).map((filePath) => {
			const rawSource = fs.readFileSync(filePath, { encoding: 'utf8' });

			return process(filePath, rawSource);
		}, []).forEach((result) => {
			// Format results Array (each result, aka. file, contains an Array of errors in that file).
			const module = this.lookup(result.moduleId);

			if (result && result.fatal && !result.ast) {
				this.errors.push(result);
				return;
			}

			module.components = module.components.concat(...visit(result.ast, this.config));
		});

		const result = Object.keys(this.modules).reduce((acc, moduleId) => {
			const module = this.lookup(moduleId);
			const family = module.family || '';

			if (!acc[family]) {
				acc[family] = {};
			}

			acc[family][moduleId] = module;

			return acc;
		}, {});

		result.errors = this.errors;

		return result;
	}
};
