'use strict';

const walkSync = require('walk-sync');
const path = require('path');
const process = require('./process');
const visit = require('./visit');
const DEFAULT_CONFIG = require('./defaults');
const Component = require('./models/component');
const Module = require('./models/module');
const Dictionary = require('./models/dictionary');
const _ = require('lodash');
const fs = require('fs');

function getComponents(node) {
	const components = _.flatten((node.components || []).map(getComponents));

	return components.concat(node.name);
}

module.exports = function parse(result) {
	const cache = {};
	let modules = Object.keys(result).reduce((acc, family) => {
		if (family === 'errors') {
			return acc;
		}

		const familyCollection = result[family];

		// find all components in its own components
		acc[family] = Object.keys(familyCollection).map((moduleId) => {
			const module = familyCollection[moduleId];
			const obj = {
				moduleId,
				components: _.uniq(getComponents(module)).filter((name) => name !== moduleId)
			};

			cache[moduleId] = obj.components;

			return obj;
		});

		return acc;
	}, {});

	modules = Object.keys(modules).reduce((acc, family) => {
		if (family === 'errors') {
			return acc;
		}

		const familyCollection = modules[family];

		// find all components inside the found components
		acc[family] = Object.keys(familyCollection).map((index) => {
			const module = familyCollection[index];
			const components = module.components.map((name) => [name].concat(cache[name]));

			return {
				moduleId: module.moduleId,
				components: _.flatten(components).filter(Boolean)
			};
		});

		return acc;
	}, {});

	return modules;
};
