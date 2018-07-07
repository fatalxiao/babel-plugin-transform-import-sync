# babel-plugin-transform-import-sync

[![CircleCI Status][circleci-image]][circleci-url]
[![NPM Version][npm-image]][npm-url]
[![License][license-image]][npm-url]

[circleci-image]: https://circleci.com/gh/fatalxiao/babel-plugin-transform-import-sync.svg?longCache=true&style=shield&circle-token=:circle-token
[circleci-url]: https://circleci.com/gh/fatalxiao/babel-plugin-transform-import-sync
[npm-image]: https://img.shields.io/npm/v/babel-plugin-transform-import-sync.svg?longCache=true&style=shield
[npm-url]: https://npmjs.org/package/babel-plugin-transform-import-sync
[license-image]: https://img.shields.io/npm/l/babel-plugin-transform-import-sync.svg?longCache=true&style=shield

A babel plugin to transform async import to sync.

## Installation

**NPM**

```bash
$ npm install babel-plugin-transform-import-sync --save-dev
```

## Usage

Use in `.babelrc`.

```json
{
    "presets": [
        "env",
        "stage-0",
        "react"
    ],
    "env": {
        "development": {
            "presets": [
                "react-hmre"
            ],
            "plugins": [
                "syntax-dynamic-import",
                "transform-import-sync"
            ]
        }
    },
    "plugins": [
        "transform-runtime",
        "transform-decorators-legacy"
    ]
}
```

## Example

Async component import like this:

```js
import asyncComponent from 'components/AsyncComponent';

export default [{
    path: '/',
    component: asyncComponent(() => import('containers/Root'))
}];
```

will be transformed to sync:

```js
import asyncComponent from 'components/AsyncComponent';

export default [{
    path: '/',
    component: asyncComponent(() => (function() {
        const component = require('containers/Root');
        return component.default || component;
    })())
}];
```