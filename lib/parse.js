'use strict';

const _ = require('lodash');
const DEFAULT_CONFIG = require('./defaults');

function getComponents(node) {
	const components = _.flatten((node.components || []).map(getComponents));

	return components.concat({
		name: node.name,
		type: node.type
	});
}

module.exports = function parse(result) {
	// store found items to prevent filtering arrays more than once
	const cache = {};
	let modules = Object.keys(result).reduce((acc, family) => {
		// do not process error family
		if (family === 'errors') {
			return acc;
		}

		const familyCollection = result[family];

		/**
		 * find all components in its own components, from:
		 *
		 * {
		 *   moduleId: '/path/to/file.hbs',
		 *   components: [{
		 *     name: 'bar',
		 *     components: [{
		 *       name: 'wow'
		 *     }]
		 *   }]
		 * }
		 *
		 * to:
		 *
		 * {
		 *   moduleId: '/path/to/file.hbs',
		 *   components: ['bar', 'wow']
		 * }
		 */
		acc[family] = Object.keys(familyCollection).map((key) => {
			const module = familyCollection[key];
			const obj = {
				name: module.name || module.moduleId,
				moduleId: module.moduleId,
				components: _.uniqBy(getComponents(module), 'name').filter(({ name }) => name !== key)
			};

			cache[key] = obj.components;

			return obj;
		});

		return acc;
	}, {});

	/**
	 * find all components inside other components, from:
	 *
	 * {
	 *   default: {
	 *    '/path/to/file.hbs': {
	 *      components: [{
	 *        name: 'bar'
	 *      }]
	 *    },
	 *    components: {
	 *      'bar': {
	 *        components: ['wow']
	 *      }
	 *    }
	 * }
	 *
	 * to:
	 *
	 * {
	 *   moduleId: '/path/to/file.hbs',
	 *   components: ['bar', 'wow']
	 * }
	 */
	modules = Object.keys(modules).reduce((acc, family) => {
		// do not process error family
		if (family === 'errors') {
			return acc;
		}

		const familyCollection = modules[family];

		// find all components inside the found components
		acc[family] = Object.keys(familyCollection).map((index) => {
			const module = familyCollection[index];
			const components = module[DEFAULT_CONFIG.FAMILY_KEYS.components].map((component) => [component].concat(cache[component.name]));

			return {
				moduleId: module.moduleId,
				name: module.name,
				components: _.flatten(components).filter((component) => component && component.name)
			};
		});

		return acc;
	}, {});

	return modules;
};
