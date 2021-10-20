const { parse } = require("@babel/parser")
const generate = require("@babel/generator").default
const fs = require('fs')
const template = require("@babel/template").default
const { parse: astParse, find, findInfo, ...rest } = require("ast-parser");
const t = require("@babel/types")


const functionConvertor = (functionString, name) => {
  //  return new Function('"use strict"; function v() { return 23;};const x = () => v(); return (x())');

  const _functionString = functionString.replace(/function __embind_register_class/g, "function _embind_register_class")
  const _name = name.replace(/__embind_register_class/g, "_embind_register_class")

  const customFunction = new Function('"use strict";' + _functionString + ';return (' + _name + ');')
  // name.match(/_embind_register_class/g) ? console.log(_name, _functionString) : console.log("not found") 
  // console.log({ _name})
  return customFunction()
}

const functionReader = (path) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        console.log({ path })
        const code = data
        const parseOptions = {
          sourceType: "module",
          plugins: ["classProperties", "typescript"],
          attachComment: false
        }
        const ast = parse(code, parseOptions)
        const [fun] = ast.program.body.filter(({ type }) => type === "FunctionDeclaration")
        const functions = ast.program.body.filter(node => node.type === "FunctionDeclaration")
        // const info = astParse(ast)
        // const moreInfo = info.declarations[0]



        // console.log("functions", functions)

        const functionsList = functions.map(functionAST => {
          const buildRequire = template(`
            var %%importName%% = require(%%source%%);
          `);

          const astTemplate = buildRequire({
            importName: t.identifier("myModule"),
            source: t.stringLiteral("my-module"),
            // customFunction: t.functionDeclaration(t.identifier(functionAST.id.name), t.restElement(functionAST.body))
          });

          const { code: output } = generate(
            // fun,
            functionAST,
            {
              retainFunctionParens: true,
              jsonCompatibleStrings: true,
              attachComment: false
            }
            //  code
          );
          //  console.log(generate(astTemplate).code)
          const convertedFun = functionConvertor(output, functionAST.id.name)
          return convertedFun
        })
        resolve(functionsList)

      })
    }
    catch(e) {
      reject(e)
    }
  })
}

module.exports = {
  astReader: functionReader
}

// const code = "class Example {}";



// const{ codeFrameColumns } = require("@babel/code-frame")

// const rawLines = `class Foo {
//   constructor()
// }`;
// const location = { start: { line: 2, column: 16 } };

// const result = codeFrameColumns(rawLines, location, {
//   /* options */
// });

// // console.log(result);

// // example 3
// var babel = require("@babel/core");
// const { transform } = require("@babel/core")
// // const  babel = require("@babel/core")

// const trm = babel.transformAsync(`
// function x () {
//   return "ssss".split("");
// }
// function y () {
//   return "ssss".split("");
// }
// `, {}).then(result => {
//   result.code;
//   result.map;
//   result.ast;
//   // console.log(result)
// });

// // console.log(trm)


// // traverse example
// const traverse = require("@babel/traverse").default

// const code = `function square(n) {
//   return n * n;
// }`;

// const ast_ = parse(code);

// traverse(ast_, {
//   enter(path) {
//     if (path.isIdentifier({ name: "n" })) {
//       path.node.name = "x";
//     }
//   },
// });
// // console.log({ ast_ })