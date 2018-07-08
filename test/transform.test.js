'use strict';

import chai from 'chai';
import {transform} from 'babel-core';
import Root from './container/Root';
import Other from './container/Other';

const expect = chai.expect,
    options = {
        plugins: [
            'syntax-dynamic-import',
            './src'
        ]
    };

describe('Transform Test', () => {

    /**
     * basic test
     *
     *  import('./container/Root')
     */
    it('basic', () => expect(eval(transform(`
        const asyncComponent = require('./vendors/asyncComponent').default;
        module.exports = [{
            path: '/',
            component: asyncComponent(() => import('./container/Root'))
        }];
    `, options).code)[0].component).to.be.equal(Root));


    /**
     * test one with a chunk comment
     *
     *  import(\/* webpackChunkName: "root" *\/'./container/Root')
     */
    it('with a chunk comment', () => expect(eval(transform(`
        const asyncComponent = require('./vendors/asyncComponent').default;
        module.exports = [{
            path: '/',
            component: asyncComponent(() => import(/* webpackChunkName: "root" */'./container/Root'))
        }];
    `, options).code)[0].component).to.be.equal(Root));


    /**
     * test multi routes
     */
    const multiRoute = eval(transform(`
        const asyncComponent = require('./vendors/asyncComponent').default;
        module.exports = [{
            path: '/',
            component: asyncComponent(() => import(/* webpackChunkName: "root" */'./container/Root'))
        },{
            path: '/other',
            component: asyncComponent(() => import(/* webpackChunkName: "other" */'./container/Other'))
        }];
    `, options).code);
    it('multi routes - 0', () => expect(multiRoute[0].component).to.be.equal(Root));
    it('multi routes - 1', () => expect(multiRoute[1].component).to.be.equal(Other));

});