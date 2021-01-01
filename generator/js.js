// Code Generator Ael -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

export default function generate(program) {
  const lines = []
  let targetNames = new Map()
  let nextSuffix = 1

  function targetName(declaration) {
    if (!targetNames.has(declaration)) {
      targetNames.set(declaration, nextSuffix)
      nextSuffix += 1
    }
    return `${declaration.name}_${targetNames.get(declaration)}`
  }

  function gen(node) {
    return generators[node.constructor.name](node)
  }

  function emit(line) {
    lines.push(line)
  }

  const generators = {
    Program(self) {
      for (const s of self.statements) {
        gen(s)
      }
    },
    Declaration(self) {
      emit(`let ${targetName(self)} = ${gen(self.initializer)};`)
    },
    Assignment(self) {
      self.source = gen(self.source)
      self.target = gen(self.target)
      emit(`${self.target} = ${self.source};`)
    },
    PrintStatement(self) {
      emit(`console.log(${gen(self.expression)});`)
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
  return lines.join("\n")
}
