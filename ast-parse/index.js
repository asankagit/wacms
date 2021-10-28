const { parse } = require("@babel/parser")
const generate = require("@babel/generator").default
const fs = require('fs')
const template = require("@babel/template").default
const { parse: astParse, find, findInfo, ...rest } = require("ast-parser");
const t = require("@babel/types")
const vm = require('vm');

const functionConvertor = (functionString, name) => {
  //  return new Function('"use strict"; function v() { return 23;};const x = () => v(); return (x())');

  const _functionString = functionString
    .replace(/function _/g, "function ")  
    .replace(/function __/g, "function _")
    

  const _name = name
    .replace(/^_/g, "")
    .replace(/^__/g, "_")
    

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

        const code = data
        const parseOptions = {
          sourceType: "module",
          plugins: ["classProperties", "typescript"],
          attachComment: false
        }
        const ast = parse(code, parseOptions)
        const [fun] = ast.program.body.filter(({ type }) => type === "FunctionDeclaration")
        const functions = ast.program.body.filter(node => node.type === "FunctionDeclaration")
        const globalObjects = ast.program.body.filter(node => node.type !== "FunctionDeclaration")

        const context = []
        const addToContext = globalObjects.map(obj => {

          const { code: globalVariables } = generate(
            obj,
            {
              retainFunctionParens: true,
              jsonCompatibleStrings: true,
              attachComment: false
            },
            code
          );
          context.push(globalVariables)
            return globalVariables
          // console.log({ globalVariables })
        })


        global.context = context.join('')

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

          const convertedFun = functionConvertor(output, functionAST.id.name)
          // console.log({convertedFun})
          global[functionAST.id.name] = convertedFun
          return convertedFun
        })

        const vm_context = {
         
          ...functionsList.reduce((a, i) => {
            // console.log([i.name])
            return {
              [i.name]: i,
              ...a
            }
          }, {})
        }

        try {
          vm.createContext(vm_context)
          addToContext.map(chunk => {         
            // vm.runInContext(chunk, vm_context);
            // eval(chunk)
            // console.log({ chunk })
          }) 
          vm.runInContext(addToContext.join(''), vm_context)
        }
        catch (e) {
          console.log(e)
        }
        resolve(vm_context)

      })
    }
    catch (e) {
      reject(e)
    }
  })
}
// functionReader("../wafunctions/cppworker/myclass.js")
module.exports = {
  astReader: functionReader
}


// node --experimental-wasi-unstable-preview1  --experimental-vm-modules index.js 
