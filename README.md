# ember-component-analyzer

[![Build Status](https://travis-ci.org/BBVAEngineering/ember-component-analyzer.svg?branch=master)](https://travis-ci.org/BBVAEngineering/ember-component-analyzer)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fember-component-analyzer.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fember-component-analyzer)
[![NPM version](https://badge.fury.io/js/ember-component-analyzer.svg)](https://badge.fury.io/js/ember-component-analyzer)
[![Dependency Status](https://david-dm.org/BBVAEngineering/ember-component-analyzer.svg)](https://david-dm.org/BBVAEngineering/ember-component-analyzer)
[![codecov](https://codecov.io/gh/BBVAEngineering/ember-component-analyzer/branch/master/graph/badge.svg)](https://codecov.io/gh/BBVAEngineering/ember-component-analyzer)
[![Greenkeeper badge](https://badges.greenkeeper.io/BBVAEngineering/ember-component-analyzer.svg)](https://greenkeeper.io/)

## Information

[![NPM](https://nodei.co/npm/ember-component-analyzer.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ember-component-analyzer/)

### This project is an experimental dark thing O_O**

This library extracts the "possibles" components that may exists in the different routes
of an Ember application. It uses Glimmer compiler to make & read the AST trees.

The lib reads all the handlebars files to find all the components (usually names that
contains `-` for components and `.` for contextual components).
Once the "possible" components are found, it replaces all the contextual components by
its real name. This part is only possible for the application components (right now its unable to read the components
inside the `ember-addons`).

## Information

[![NPM](https://nodei.co/npm/ember-component-analyzer.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ember-component-analyzer/)

## How to use

1. Import the lib

```js
const lib = require('ember-component-analyzer');
```

2. Process the application

```js
#!/usr/bin/env node

const { Analyzer, parse } = lib;

const analyzer = new Analyzer(process.argv.slice(2), {
  // options...
});
const result = analyzer.process(); // Hell JSON
const output = parse(result); // Friendly JSON with the application data
```

3. Save the results, process or do whatever you want

## Options

The `Analyzer` class accepts an object as config. The possible attributes are:

- **families**: An object containing the different typologies of the templates
(components, helpers, routes, ...) and the `RegExp` used to recognize the type.
These families represents the attributes of the result object after parsing
the files.

Defaults to:

```javascript
{
  components: /components/, // the file path contains the word "components"
  default: /^((?!components).)*$/ // the file path not contains the word "components"
}
```

- **getNodeName**: This function receives an **AST node** as first argument and
it should return the component name (if valid) or `null` if you don't want
the element to appear in the report (for example a blacklisted element).

## Example

Given:

- Component `my-wrapper.hbs`:

```handlebars
<div>
  {{yield (hash header=(component 'my-header'))}}
  {{my-footer}}
</div>
```

- Component `my-header.hbs`:

```handlebars
{{link-to}}
```

- Route `index.hbs`:

```handlebars
{{#my-wrapper as |wrapper|}}
  {{wrapper.header}}
{{/my-wrapper}}
```

Then it will generate an output (using the exported `parser`) similar to:

```json
{
  "default": [{
    "moduleId": "index.hbs",
    "components": ["my-wrapper", "header-main", "link-to", "my-footer"]
  },
  "components": [{
    "moduleId": "my-wrapper",
    "components": ["my-footer"]
  }, {
    "moduleId": "my-header",
    "components": ["link-to"]
  }]
}
```

## Readable report?

Working on it :)

![report](https://cdn.pbrd.co/images/GKXhxwx.png)

## Contributing

We're thankful to the community for contributing any improvements.

Do not forget to follow our [eslint](https://github.com/BBVAEngineering/javascript/tree/master/eslint-config-bbva) rules and make test for the new functionalities/fixes.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/ember-storages/tags).

## Authors

See the list of [contributors](https://github.com/BBVAEngineering/ember-storages/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
