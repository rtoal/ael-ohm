import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = String.raw`   1 | Program statements=[#2,#7,#10,#12]
   2 | VariableDeclaration name='dozen' initializer=#3 variable=#6
   3 | BinaryExpression op='*' left=1 right=#4
   4 | BinaryExpression op='+' left=0 right=#5
   5 | UnaryExpression op='sqrt' operand=101.3
   6 | Variable name='dozen'
   7 | VariableDeclaration name='y' initializer=#8 variable=#9
   8 | BinaryExpression op='-' left=#6 right=0
   9 | Variable name='y'
  10 | Assignment target=#6 source=#11
  11 | BinaryExpression op='/' left=0 right=#9
  12 | PrintStatement argument=#13
  13 | UnaryExpression op='abs' operand=#6`

const errorFixture = [
  ["redeclarations", "print x", /Identifier x not declared/],
  ["non declared ids", "let x = 1\nlet x = 1", /Identifier x already declared/],
]

describe("The analyzer", () => {
  it("can analyze all the nodes", done => {
    assert.deepStrictEqual(util.format(analyze(parse(source))), expectedAst)
    done()
  })
  for (const [scenario, source, errorMessagePattern] of errorFixture) {
    it(`throws on ${scenario}`, done => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
      done()
    })
  }
})
