// Code Generator Ael -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

export default function generate(program) {
  const output = []

  // Variable names in JS will be suffixed with _1, _2, _3, etc. This is
  // because "while", for example, is a legal variable name in Ael, but
  // not in JS. So we want to generate something like "while_1". We handle
  // this by mapping each variable declaration to its suffix.
  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${entity.name}_${mapping.get(entity)}`
    }
  })(new Map())

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    Program(p) {
      gen(p.statements)
    },
    Variable(v) {
      output.push(`let ${targetName(v)} = ${gen(v.initializer)};`)
    },
    Assignment(s) {
      const source = gen(s.source)
      const target = gen(s.target)
      output.push(`${target} = ${source};`)
    },
    PrintStatement(s) {
      output.push(`console.log(${gen(s.argument)});`)
    },
    BinaryExpression(e) {
      return `(${gen(e.left)} ${e.op} ${gen(e.right)})`
    },
    UnaryExpression(e) {
      const op = { abs: "Math.abs", sqrt: "Math.sqrt" }[e.op] ?? e.op
      return `${op}(${gen(e.operand)})`
    },
    IdentifierExpression(e) {
      return targetName(e.referent)
    },
    Literal(e) {
      return e.value
    },
    Array(a) {
      a.forEach(gen)
    },
  }

  gen(program)
  return output.join("\n")
}
