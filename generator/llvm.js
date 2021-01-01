// Code Generator Ael -> LLVM
//
// Invoke generate(program) with the program node to get the LLVM translation
// as a string. As this compiler is written totally from scratch, we're not
// using any LLVM libraries and we're just writing out LLVM IR as text.

export default function generate(program) {
  const output = []
  let llvmRegisters = new Map()
  let nextRegister = -1

  const allocateRegister = () => `%${++nextRegister}`

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    Program(self) {
      output.push('@format = private constant [3 x i8] c"%g\\0A"')
      output.push("declare i64 @printf(i8*, ...)")
      output.push("declare double @llvm.fabs(double)")
      output.push("declare double @llvm.sqrt.f64(double)")
      output.push("define i64 @main() {")
      output.push("entry:")
      self.statements.forEach(gen)
      output.push("ret i64 0")
      output.push("}")
    },
    Declaration(self) {
      // Ael is such a boring language; since there are no loops or
      // conditions, Ael variables just map to the generated LLVM ones,
      // so it's frighteningly trivial.
      llvmRegisters[self] = gen(self.initializer)
    },
    Assignment(self) {
      // There’s no difference between declarations and assignments here;
      // by this time in the complier, we’ve already checked that
      // assignments refer to already-declared Ael variables. So
      // whatever got computed on the right hand side is what this
      // variable will reference form now on.
      llvmRegisters[self.target.ref] = gen(self.source)
    },
    PrintStatement(self) {
      const format =
        "i8* getelementptr inbounds ([3 x i8], [3 x i8]* @format, i64 0, i64 0)"
      const operand = `double ${gen(self.expression)}`
      output.push(`call i64 (i8*, ...) @printf(${format}, ${operand})`)
    },
    BinaryExpression(self) {
      const op = { "+": "fadd", "-": "fsub", "*": "fmul", "/": "fdiv" }[self.op]
      const left = gen(self.left)
      const right = gen(self.right)
      const target = allocateRegister()
      output.push(`${target} = ${op} double ${left}, ${right}`)
      return target
    },
    UnaryExpression(self) {
      const operand = gen(self.operand)
      const source =
        self.op == "-"
          ? `fneg double ${operand}`
          : self.op == "abs"
          ? `call double @llvm.fabs(double ${operand})`
          : `call double @llvm.sqrt.f64(double ${operand})`
      const target = allocateRegister()
      output.push(`${target} = ${source}`)
      return target
    },
    IdentifierExpression(self) {
      return llvmRegisters[self.ref]
    },
    LiteralExpression(self) {
      // LLVM is very picky about its float literals!
      return `${self.value}${Number.isInteger(self.value) ? ".0" : ""}`
    },
  }

  gen(program)
  return output.join("\n")
}
