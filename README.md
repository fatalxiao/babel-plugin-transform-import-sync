# babel-plugin-transform-import-sync

A babel plugin to transform import to sync.

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