'use strict';

import chai from 'chai';
import {transform} from '@babel/core';
import Root from './container/Root';
import Other from './container/Other';

const expect = chai.expect,
    options = {
        plugins: [
            '@babel/plugin-syntax-dynamic-import',
            './src'
        ]
    };

describe('Transform Test', () => {

    /**
     * basic test
     *
     *  import('...')
     */
    it('basic', () => expect(eval(transform(`
        const asyncComponent = require('./vendors/asyncComponent').default;
        module.exports = [{
            path: '/',
            component: asyncComponent(() => import('./container/Root'))
        }];
    `, options).code)[0].component).to.be.equal(Root));


    /**
     * test one with a chunk comment, and comment will be removed
     *
     *  import(\/* ... *\/'...')
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


    /**
     * test one with an asyncComponent config
     *
     *  asyncComponent(() => import('...'), config)
     */
    it('with an asyncComponent config', () => expect(eval(transform(`
        const asyncComponent = require('./vendors/asyncComponent').default,
              config = {/* ... */};
        module.exports = [{
            path: '/',
            component: asyncComponent(() => import(/* webpackChunkName: "root" */'./container/Root'), config)
        }];
    `, options).code)[0].component).to.be.equal(Root));

});