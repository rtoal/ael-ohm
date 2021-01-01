// Code Generator Ael -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.
//
// Variable names in JavaScript will be suffixed with _1, _2, _3, etc. This
// is because "while", for example, is a legal variable name in Ael, but not
// in JavaScript. So we want to generate something like "while_1".

export default function generate(program) {
  const output = []
  let targetNames = new Map()

  function targetName(declaration) {
    if (!targetNames.has(declaration)) {
      targetNames.set(declaration, targetNames.size + 1)
    }
    return `${declaration.name}_${targetNames.get(declaration)}`
  }

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    Program(p) {
      p.statements.forEach(gen)
    },
    Declaration(d) {
      output.push(`let ${targetName(d)} = ${gen(d.initializer)};`)
    },
    Assignment(s) {
      const source = gen(s.source)
      const target = gen(s.target)
      output.push(`${target} = ${source};`)
    },
    PrintStatement(s) {
      output.push(`console.log(${gen(s.expression)});`)
    },
    BinaryExpression(e) {
      return `(${gen(e.left)} ${e.op} ${gen(e.right)})`
    },
    UnaryExpression(e) {
      const op = { abs: "Math.abs", sqrt: "Math.sqrt" }[e.op] ?? e.op
      return `${op}(${gen(e.operand)})`
    },
    IdentifierExpression(e) {
      return targetName(e.ref)
    },
    LiteralExpression(e) {
      return e.value
    },
  }

  gen(program)
  return output.join("\n")
}
