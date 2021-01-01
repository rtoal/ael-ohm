// Code Generator Ael -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

export default function generate(program) {
  const output = []
  let targetNames = new Map()
  let nextSuffix = 1

  function targetName(declaration) {
    if (!targetNames.has(declaration)) {
      targetNames.set(declaration, nextSuffix++)
    }
    return `${declaration.name}_${targetNames.get(declaration)}`
  }

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    Program(self) {
      for (const s of self.statements) {
        gen(s)
      }
    },
    Declaration(self) {
      output.push(`let ${targetName(self)} = ${gen(self.initializer)};`)
    },
    Assignment(self) {
      const source = gen(self.source)
      const target = gen(self.target)
      output.push(`${target} = ${source};`)
    },
    PrintStatement(self) {
      output.push(`console.log(${gen(self.expression)});`)
    },
    BinaryExpression(self) {
      return `(${gen(self.left)} ${self.op} ${gen(self.right)})`
    },
    UnaryExpression(self) {
      const op = { abs: "Math.abs", sqrt: "Math.sqrt" }[self.op] ?? self.op
      return `${op}(${gen(self.operand)})`
    },
    IdentifierExpression(self) {
      return targetName(self.ref)
    },
    LiteralExpression(self) {
      return self.value
    },
  }

  gen(program)
  return output.join("\n")
}
