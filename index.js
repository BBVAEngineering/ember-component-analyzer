const parse = require('@glimmer/syntax').preprocess;
const traverse = require('@glimmer/syntax').traverse;
const TransformDotComponentInvocation = require('ember-template-lint/lib/plugins/transform-dot-component-invocation');
const walkSync = require('walk-sync');
const stripBom = require('strip-bom');
const fs = require('fs');
const path = require('path');

function preprocess(filePath) {
	const template = stripBom(fs.readFileSync(filePath, { encoding: 'utf8' }));
	let result;

	try {
		const ast = parse(template, {
			moduleName: filePath,
			rawSource: template,
			plugins: {
				ast: [
					TransformDotComponentInvocation
				]
			}
		});

		result = {
			ast,
			moduleId: filePath
		};
	} catch (error) {
		result = {
			fatal: true,
			moduleId: filePath,
			message: error.message,
			source: error.stack,
			severity: 2
		};
	}

	return result;
}

function getModule(modules, moduleId) {
	let module = modules[moduleId];

	if (!module) {
		module = {
			components: [],
			hasYield: false,
			yield: {}
		};
		modules[moduleId] = module;
	}

	return module;
}

function analyze(paths = []) {
	const modules = {
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
		 *   "hasYield": [boolean],
		 *   "yield": {
		 *      "key": ["component-name"|boolean]
		 *    }
		 * }
		 **/
	};

	paths
		.map((dirPath) => {
			if (dirPath[dirPath.length - 1] !== path.sep) {
				return `${dirPath}${path.sep}`;
			}

			return dirPath;
		})
		.reduce((acc, basePath) => {
			// Get all handlebars files.
			const files = walkSync(basePath, { globs: ['**/*.hbs'] });
			const pathResults = files.map((file) => preprocess(basePath + file));

			return acc.concat(pathResults);
		}, [])
	// Format results Array (each result, aka. file, contains an Array of errors in that file).
		.forEach((result) => {
			const module = getModule(modules, result.moduleId);

			if (result && result.fatal && !result.ast) {
				console.error('error', result);
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
					} else if (node.path.original.indexOf('.')) {
						if (node.path.original === 'yield') {
							module.hasYield = true;
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
							module.components.push({
								name: node.path.original,
								// loc: node.loc
							});
						}
					} else {
						console.log('---------- MustachElement ----------');
						console.log(result.moduleId);
						console.log(node);
						console.log('------------------------------------');
					}
				}
			});
		});

	return modules;
}

module.exports = {
	analyze
};
