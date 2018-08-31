import {declare} from '@babel/helper-plugin-utils';
import syntax from '@babel/plugin-syntax-dynamic-import';

export default declare((api, options) => {

    api.assertVersion(7);

    const buildImport = api.template('\
        (function() {const component = require(SOURCE); return component.default || component;})()\
    ');

    return {
        inherits: syntax,
        visitor: {
            Import(path) {

                const importArguments = path.parentPath.node.arguments,
                    isString = api.types.isStringLiteral(importArguments[0])
                        || api.types.isTemplateLiteral(importArguments[0]);

                if (isString) {
                    api.types.removeComments(importArguments[0]);
                }

                if (path.parentPath) {
                    path.parentPath.replaceWith(buildImport({
                        SOURCE: isString ?
                            importArguments
                            :
                            api.types.templateLiteral([
                                api.types.templateElement({raw: '', cooked: ''}),
                                api.types.templateElement({raw: '', cooked: ''}, true)
                            ], importArguments)
                    }));
                }

            }
        }
    };

});