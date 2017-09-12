const traverse = require('@glimmer/syntax').traverse;
const walkSync = require('walk-sync');
const path = require('path');
const processFile = require('./process-file');
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

		this.errors = [];

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
			 *   "yields": [Number],
			 *   "yield": {
			 *      "key": ["component-name"|Boolean]
			 *    }
			 * }
			 **/
		};
	}

	lookup(moduleId) {
		const families = Object.keys(this.config.families);
		let module = this.modules[moduleId];

		if (!module) {
			module = {
				components: [],
				family: families.find((family) => this.config.families[family].test(moduleId)) || this.config.defaultFamily,
				yields: 0,
				yield: {}
			};
			this.modules[moduleId] = module;
		}

		return module;
	}

	_logNode(title, node) {
		// console.log(`---------- ${title} ----------`);
		// console.log(result.moduleId);
		// console.log(node);
		// console.log('------------------------------------');
	}

	process() {
		this.paths.reduce((acc, basePath) => {
			// Get all handlebars files.
			const files = walkSync(basePath, { globs: ['**/*.hbs'] });
			const pathResults = files.map((file) => processFile(basePath + file));

			return acc.concat(pathResults);
		}, [])
		// Format results Array (each result, aka. file, contains an Array of errors in that file).
		.forEach((result) => {
			const module = this.lookup(result.moduleId);

			if (result && result.fatal && !result.ast) {
				this.errors.push(result);
				return;
			}

			// console.log('result', result);
			traverse(result.ast, {
				MustacheStatement(node) {
					/**
					 * single line handlebars expression:
					 * {{foo}}
					 * {{foo bar=wow}}
					 * (foo bar)
					 * ...
					 **/
					if (node.path.original === 'component') {
						module.components.push({
							name: node.params[0].original,
							// loc: node.params[0].loc
						});
					} else if (node.path.original === 'yield') {
						module.yields++;
						// Check if yield has contextual components
						if (node.params.length) {
							const contextuals = node.params[0].hash.pairs;

							contextuals.forEach((contextual) => {
								// check if positional yield: {{yield (hash footer=true)}}
								if (typeof contextual.value !== 'object') {
									module.yield[contextual.key] = contextual.value;
								} else {
									// hash value could not be a component so print the name of the var
									if (!contextual.value.params) {
										module.yield[contextual.key] = contextual.value.original;
									} else {
										module.yield[contextual.key] = contextual.value.params[0].original;
									}
								}
							});
						}
					} else {
						// Some elements like {{input}} can be catched here, but I don't know how yet >.<
						// module.components.push({
						// 	name: node.path.original,
						// 	loc: node.loc
						// });
						// this._logNode(node);
					}
				}
			});
		});

		return {
			modules: this.modules,
			errors: this.errors
		};
	}
};
