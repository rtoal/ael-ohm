import assert from "assert"
import { LiteralExpression, PrintStatement, Program } from "../ast.js"
import compile from "../compiler.js"

describe("The compiler", () => {
  it("says Unknown output type when the output type is unknown", done => {
    assert.strictEqual(compile("print 0", "blah"), "Unknown output type")
    done()
  })
  it("returns the expected AST for the simplest program", done => {
    assert.deepStrictEqual(
      compile("print 0", "ast"),
      new Program([new PrintStatement(new LiteralExpression(0))])
    )
    done()
  })
})
