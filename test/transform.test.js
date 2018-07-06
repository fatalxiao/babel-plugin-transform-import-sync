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
        expect(transform(`
            module.exports = [{
                path: '/',
                exact: true,
                component: asyncComponent(() => import(/* webpackChunkName: "root" */'./container/root'))
            }];
        `, options)).to.be.equal(`
            module.exports = [{
                path: '/',
                exact: true,
                component: asyncComponent(() => (function() {const component = require('./container/root'); return component.default || component;})())
            }];
        `)
    );

});