// Code Generator Ael -> C
//
// Invoke generate(program) with the program node to get back the C translation
// as a string.

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
      output.push("#include <stdio.h>")
      output.push("#include <math.h>")
      output.push("int main() {")
      for (const s of self.statements) {
        gen(s)
      }
      output.push("return 0;")
      output.push("}")
    },
    Declaration(self) {
      output.push(`double ${targetName(self)} = ${gen(self.initializer)};`)
    },
    Assignment(self) {
      const source = gen(self.source)
      const target = gen(self.target)
      output.push(`${target} = ${source};`)
    },
    PrintStatement(self) {
      output.push(`printf("%g\\n", ${gen(self.expression)});`)
    },
    BinaryExpression(self) {
      return `(${gen(self.left)} ${self.op} ${gen(self.right)})`
    },
    UnaryExpression(self) {
      const op = { abs: "fabs" }[self.op] ?? self.op
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
