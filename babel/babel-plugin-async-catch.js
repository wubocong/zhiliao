const types = require('@babel/types');
const parser = require("@babel/parser");

const defaultOptions = {
    catchClause: identifier => `
        console.error(${identifier});
    `,
    identifier: "err"
};

// 判断是否为 async 函数
const isAsyncFunctionExpression = node =>
    // async function func() {} 函数声明
    types.isFunctionDeclaration(node, {
        async: true
    }) || 
    // async () => {} 箭头函数
    types.isArrowFunctionExpression(node, {
        async: true
    }) || 
    // let func = async function() {} 、 let obj = { async fuc() {} } 函数表达式
    types.isFunctionExpression(node, {
        async: true
    });
    
const visitor = {
    // 从 await 语句开始逆向检查，有则跳过，无则添加
    AwaitExpression(path, { opts = {} }) {
        // 处理参数
        let { catchClause, identifier, finallyClause } = Object.assign({}, defaultOptions, opts);

        // 根据参数生成 node
        if (typeof catchClause === "function") {
            catchClause = catchClause(identifier);
        }
        let catchClauseNode = parser.parse(catchClause).program.body;

        let finallyClauseNode = finallyClause && parser.parse(finallyClause).program.body;

        while (path) {
            let { node, parentPath } = path;

            if (!node) return;

            // 如果已经存在 try catch 则直接退出
            if (types.isTryStatement(parentPath.node)) return;
            
            // 如果向上遍历找到的是 async fucntion 则说明没有添加 try catch
            /**
             * 多层结构，判断只需要 AsyncFunctionExpression ，但是需要操作的是 BlockStatement 
             * AsyncFunctionExpression
             *  BlockStatement
             *    ...
             *       AwaitExpression
             */
            if (isAsyncFunctionExpression(parentPath.node)) {
                // 使用原内容生成新的代码块
                let tryCatchAst = types.tryStatement(
                    // 当前 BlockStatement 直接作为 try block 内容
                    node, 
                    // 需要根据参数生成 handler 
                    types.catchClause(
                        types.identifier(identifier), // param - name 用配置参数生成 identifier
                        types.blockStatement(catchClauseNode) // body
                    ),
                    // 按配置决定是否加入 finally
                    finallyClauseNode && types.blockStatement(finallyClauseNode)
                );
                // 替换内容
                path.replaceWithMultiple([tryCatchAst]);
                return;
            }

            // 遍历下一层
            path = parentPath;
        }
    }
};

module.exports = function () {
    return {
        name: "async-catch",
        visitor
    };
};