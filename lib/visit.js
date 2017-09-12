const traverse = require('@glimmer/syntax').traverse;

module.exports = function visit(ast, module) {
	traverse(ast, {
		BlockStatement(node) {
			if (node.path.original === 'component') {
				/**
				 * {{#foo}}{{/foo}}
				 */
				module.components.push({
					name: node.params[0].original,
					// loc: node.loc
				});
			} else if (node.path.original.indexOf('-') > 0) {
				/**
				 * {{#my-component}}{{/my-component}}
				 */
				module.components.push({
					name: node.path.original,
					// loc: node.loc
				});
			} else {
				// logNode('BlockStatement', result.moduleId, node);
			}
		},

		MustacheStatement(node) {
			if (node.path.original === 'component') {
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
					const contextuals = node.params[0].hash.pairs;

					contextuals.forEach((contextual) => {
						// check if positional yield: {{yield (hash footer=true)}}
						if (typeof contextual.value !== 'object') {
							module.yield[contextual.key] = contextual.value;
						} else if (!contextual.value.params) {
							// hash value could not be a component so print the name of the var
							module.yield[contextual.key] = contextual.value.original;
						} else {
							module.yield[contextual.key] = contextual.value.params[0].original;
						}
					});
				}
			} else {
				// Some elements like {{input}} can be catched here, but I don't know how yet >.<
				// module.components.push({
				// 	name: node.path.original,
				// 	loc: node.loc
				// });
				// logNode('MustacheStatement', result.moduleId, node);
			}
		}
	});
};
