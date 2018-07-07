'use strict';

import chai from 'chai';
import {transform} from 'babel-core';
import Root from './container/Root';

const expect = chai.expect,
    options = {
        plugins: [
            'syntax-dynamic-import',
            './src'
        ]
    };

describe('Transform Test', () => {

    it('default', () => expect(eval(transform(`
        const asyncComponent = require('./vendors/asyncComponent').default;
        module.exports = [{
            path: '/',
            exact: true,
            component: asyncComponent(() => import('./container/Root'))
        }];
    `, options).code)[0].component).to.be.equal(Root));

    it('with comment', () => expect(eval(transform(`
        const asyncComponent = require('./vendors/asyncComponent').default;
        module.exports = [{
            path: '/',
            exact: true,
            component: asyncComponent(() => import(/* webpackChunkName: "root" */'./container/Root'))
        }];
    `, options).code)[0].component).to.be.equal(Root));

});