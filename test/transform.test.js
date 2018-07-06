'use strict';

import chai from 'chai';
import {transform} from 'babel-core';

const expect = chai.expect,
    options = {
        plugins: [
            'syntax-dynamic-import',
            './src'
        ]
    };

describe('Transform Test', () => {

    it('default', () =>
        expect(JSON.stringify(transform(`
            module.exports = [{
                path: '/',
                exact: true,
                component: asyncComponent(() => import(/* webpackChunkName: "root" */'./container/root'))
            }];
        `, options))).to.include(`component: asyncComponent(() => function () {\\n        const component = require('./container/root');\\n\\n        return component.default || component;\\n    }())`)
    );

});