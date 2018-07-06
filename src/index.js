const syntax = require('babel-plugin-syntax-dynamic-import');

module.exports = function ({template, types}) {

    const buildImport = template('\
        (function() {const component = require(SOURCE); return component.default || component;})()\
    ');

    return {

        inherits: syntax,

        visitor: {
            Import(path) {

                const importArguments = path.parentPath.node.arguments,
                    isString = types.isStringLiteral(importArguments[0]) || types.isTemplateLiteral(importArguments[0]);

                if (isString) {
                    types.removeComments(importArguments[0]);
                }

                if (path.parentPath) {
                    path.parentPath.replaceWith(buildImport({
                        SOURCE: isString ?
                            importArguments
                            :
                            types.templateLiteral([
                                types.templateElement({raw: '', cooked: ''}),
                                types.templateElement({raw: '', cooked: ''}, true)
                            ], importArguments)
                    }));
                }

            }
        }

    };
};