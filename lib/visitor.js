const traverse = require('@glimmer/syntax').traverse;

function logNode(title, moduleId, node) {
	console.log(`---------- ${title} ----------`);
	console.log(moduleId);
	console.log(node);
	console.log('------------------------------------');
}

module.exports = function visit(ast, module) {
	traverse(ast, {
		BlockStatement(node) {
			// check contextual components
			if (node.path.original === 'component') {
				module.components.push({
					name: node.params[0].original,
					// loc: node.loc
				});
			} else if (node.path.original.indexOf('-') > 0) {
				module.components.push({
					name: node.path.original,
					// loc: node.loc
				});
			} else {
				logNode('BlockStatement', result.moduleId, node);
			}
		},

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
				// logNode('MustacheStatement', result.moduleId, node);
			}
		}
	});
};
