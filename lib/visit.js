const traverse = require('@glimmer/syntax').traverse;
const _ = require('lodash');

function logNode(title, moduleId, node) {
	console.log(`---------- ${title} ----------`);
	console.log(moduleId);
	console.log(node);
	console.log('------------------------------------');
}

function getComponent(node) {
	let name;

	if (node.type === 'BlockStatement' || node.type === 'MustacheStatement') {
		name = (node.params.length && node.params[0].original) || node.path.original;
	}

	return name ? { name } : null;
}

function lookupContextuals(node, disallowed = ['each', 'if', 'unless', 'with']) {
	let components = [];

	if (node.type === 'ElementNode' && node.children && node.children.length) {
		components = node.children
			.map((child) => lookupContextuals(child, disallowed))
			.filter(Boolean);
	} else if (node.program && node.program.body && node.program.body.length) {
		components = node.program.body
			.map((child) => lookupContextuals(child, disallowed))
			.filter(Boolean);
	} else {
		return getComponent(node);
	}

	const module = getComponent(node);

	// return an array to be flattened
	if (disallowed.includes(node.path && node.path.original) || !module) {
		return components;
	}

	if (module) {
		module.components = _.flattenDeep(components);
	}

	return module;
}

module.exports = function visit(ast, module) {
	module.components.push(lookupContextuals({ program: ast, path: { original: 'ast' } }))

	return module;
	traverse(ast, {
		BlockStatement(node) {
			if (node.path && node.path.original === 'form-container') {
				module.components.push(lookupContextuals(node));
			} else
			if (node.path.original === 'component') {
				/**
				 * block component:
				 * {{#foo}}{{/foo}}
				 */
				module.components.push({
					name: node.params[0].original,
					// loc: node.loc
				});
			} else if (node.path.original.indexOf('-') > 0) {
				const component = {
					name: node.path.original,
					components: []
					// loc: node.loc
				};

				node.program.body
					.filter((child) => child.type === 'MustacheStatement')
					.forEach((child) => {
						if (child.params && child.params.length) {
							component.components.push(child.params[0].original);
						} else {
							component.components.push(child.path.original);
						}
					});

				node.program.body
					.filter((child) => child.type === 'BlockStatement')
					.forEach((child) => {
						// console.log(lookupContextuals(child))
					});
				/**
				 * block custom component:
				 * {{#my-component}}{{/my-component}}
				 */
				module.components.push(component);
			} else {
				// logNode('BlockStatement', result.moduleId, node);
			}
		},

		MustacheStatement(node) {
			if (node.path.original.indexOf('.') > 0) {
				return;
				/**
				 * contextual components:
				 * {{foo.bar}}
				 */
				module.components.push({
					name: node.path.original,
					// loc: node.loc
				});
			} else if (node.path.original === 'component') {
				// do nothing with contextual components, it will be handler by the parent block node
				if (node.params[0].original.indexOf('.') > 0) {
					return;
				}

				/**
				 * single line handlebars expression:
				 * {{foo}}
				 * {{foo bar=wow}}
				 * (foo bar)
				 * ...
				 **/
				module.components.push({
					name: node.params[0].original,
					// loc: node.params[0].loc
				});
			} else if (node.path.original.indexOf('-') > 0) {
				/**
				 * custom app components:
				 * {{my-component}}
				 */
				module.components.push({
					name: node.path.original,
					// loc: node.loc
				});
			} else if (node.path.original === 'yield') {
				/**
				 * {{yield}}
				 */
				module.yields++;
				if (node.params.length) {
					/**
					 * {{yield (hash foo=bar)}}
					 */
					const components = node.params[0].hash.pairs;

					components.forEach((contextual) => {
						// check if positional yield: {{yield (hash footer=true)}}
						if (typeof contextual.value !== 'object') {
							module.yield[contextual.key] = contextual.value;
						} else if (contextual.value.params && contextual.value.params.length) {
							// hash value could not be a component so print the name of the var
							module.yield[contextual.key] = contextual.value.params[0].original;
						} else {
							module.yield[contextual.key] = contextual.value.original;
						}
					});
				}
			} else {
				// Some elements like {{input}} can be catched here, but I don't know how yet >.<
				// module.components.push({
				// 	name: node.path.original,
				// 	loc: node.loc
				// });
				// logNode('MustacheStatement', node);
			}
		}
	});
};
