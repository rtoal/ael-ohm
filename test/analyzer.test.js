import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = String.raw`   1 | Program statements=[#2,#6,#9,#13]
   2 | Variable name='dozen' initializer=#3
   3 | BinaryExpression op='*' left=1 right=#4
   4 | BinaryExpression op='+' left=0 right=#5
   5 | UnaryExpression op='sqrt' operand=101.3
   6 | Variable name='y' initializer=#7
   7 | BinaryExpression op='-' left=#8 right=0
   8 | IdentifierExpression name='dozen' referent=#2
   9 | Assignment target=#10 source=#11
  10 | IdentifierExpression name='dozen' referent=#2
  11 | BinaryExpression op='/' left=0 right=#12
  12 | IdentifierExpression name='y' referent=#6
  13 | PrintStatement argument=#14
  14 | UnaryExpression op='abs' operand=#15
  15 | IdentifierExpression name='dozen' referent=#2`

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
