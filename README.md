# ember-component-analyzer

**This project is an experimental dark thing O_O**

This library extracts the "possibles" components that may exists in the different routes
of an Ember application. It uses Glimmer compiler to make & read the AST trees.

The lib reads all the handlebars files to find all the components (usually names that 
contains `-` for components and `.` for contextual components).
Once the "possible" components are found, it replaces all the contextual components by
its real name. This part is only possible for the application components (right now its unable to read the components
inside the `ember-addons`).

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


## Example

Given:

- Component `my-wrapper.hbs`:

```handlebars
<div>
	{{yield (hash	header=(component 'my-header'))}}
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

# Readable report?

Working on it :)

![report](https://cdn.pbrd.co/images/GKXhxwx.png)
