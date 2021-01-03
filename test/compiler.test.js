import assert from "assert"
import util from "util"
import compile from "../src/compiler.js"

const sampleProgram = "print 0"

describe("The compiler", () => {
  it("says 'Unknown output type' when the output type is unknown", done => {
    assert.strictEqual(compile("print 0", "blah"), "Unknown output type")
    done()
  })
  it("calls the compiler with the ast option", done => {
    const compiled = compile(sampleProgram, "ast")
    assert(util.format(compiled).startsWith("   1 | program: Program"))
    done()
  })
  it("calls the compiler with the analyzed option", done => {
    const compiled = compile(sampleProgram, "analyzed")
    assert(util.format(compiled).startsWith("   1 | program: Program"))
    done()
  })
  it("calls the compiler with the optimized option", done => {
    const compiled = compile(sampleProgram, "optimized")
    assert(util.format(compiled).startsWith("   1 | program: Program"))
    done()
  })
  it("generates js code when given the js option", done => {
    const compiled = compile(sampleProgram, "js")
    assert(util.format(compiled).startsWith("console.log(0)"))
    done()
  })
  it("generates js code when given the c option", done => {
    const compiled = compile(sampleProgram, "c")
    assert(util.format(compiled).startsWith("#include"))
    done()
  })
  it("generates js code when given the llvm option", done => {
    const compiled = compile(sampleProgram, "llvm")
    assert(util.format(compiled).startsWith("@format ="))
    done()
  })
  it("returns an error message on a bad option argument", done => {
    const compiled = compile(sampleProgram, "llvmmmmmmm")
    assert(util.format(compiled).startsWith("Unknown output type"))
    done()
  })
})
