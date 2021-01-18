// Code Generator Ael -> LLVM
//
// Invoke generate(program) with the program node to get the LLVM translation
// as a string. As this compiler is written totally from scratch, we're not
// using any LLVM libraries and we're just writing out LLVM IR as text.

export default function generate(program) {
  const output = []
  let registerFor = new Map()
  let nextRegister = 0

  // LLVM local registers are named %0, $1, %2, ...
  const allocateRegister = () => `%${nextRegister++}`

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    Program(p) {
      output.push('@format = private constant [3 x i8] c"%g\\0A"')
      output.push("declare i64 @printf(i8*, ...)")
      output.push("declare double @llvm.fabs(double)")
      output.push("declare double @llvm.sqrt.f64(double)")
      output.push("define i64 @main() {")
      output.push("entry:")
      gen(p.statements)
      output.push("ret i64 0")
      output.push("}")
    },
    Variable(v) {
      // Ael is such a boring language; since there are no loops or
      // conditions, Ael variables just map to the generated LLVM
      // registers, so it's frighteningly trivial.
      registerFor[v] = gen(v.initializer)
    },
    Assignment(s) {
      // There’s no difference between declarations and assignments here;
      // by this time in the complier, we’ve already checked that
      // assignments refer to already-declared Ael variables. So
      // whatever got computed on the right hand side is what this
      // variable will reference form now on.
      registerFor[s.target.referent] = gen(s.source)
    },
    PrintStatement(s) {
      const format =
        "i8* getelementptr inbounds ([3 x i8], [3 x i8]* @format, i64 0, i64 0)"
      const operand = `double ${gen(s.argument)}`
      output.push(`call i64 (i8*, ...) @printf(${format}, ${operand})`)
    },
    BinaryExpression(e) {
      const op = { "+": "fadd", "-": "fsub", "*": "fmul", "/": "fdiv" }[e.op]
      const left = gen(e.left)
      const right = gen(e.right)
      const target = allocateRegister()
      output.push(`${target} = ${op} double ${left}, ${right}`)
      return target
    },
    UnaryExpression(e) {
      const operand = gen(e.operand)
      const source =
        e.op == "-"
          ? `fneg double ${operand}`
          : e.op == "abs"
          ? `call double @llvm.fabs(double ${operand})`
          : `call double @llvm.sqrt.f64(double ${operand})`
      const target = allocateRegister()
      output.push(`${target} = ${source}`)
      return target
    },
    IdentifierExpression(e) {
      return registerFor[e.referent]
    },
    Literal(e) {
      // LLVM is very picky about its float literals!
      return `${e.value}${Number.isInteger(e.value) ? ".0" : ""}`
    },
    Array(a) {
      a.forEach(gen)
    },
  }

  gen(program)
  return output.join("\n")
}
