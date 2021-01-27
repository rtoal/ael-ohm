import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = String.raw`   1 | Program statements=[$2,$9,$13,$18]
   2 | Variable name='dozen' initializer=$3
   3 | BinaryExpression op='*' left=$4 right=$5
   4 | Literal value=1
   5 | BinaryExpression op='+' left=$6 right=$7
   6 | Literal value=0
   7 | UnaryExpression op='sqrt' operand=$8
   8 | Literal value=101.3
   9 | Variable name='y' initializer=$10
  10 | BinaryExpression op='-' left=$11 right=$12
  11 | IdentifierExpression name='dozen' referent=$2
  12 | Literal value=0
  13 | Assignment target=$14 source=$15
  14 | IdentifierExpression name='dozen' referent=$2
  15 | BinaryExpression op='/' left=$16 right=$17
  16 | Literal value=0
  17 | IdentifierExpression name='y' referent=$9
  18 | PrintStatement argument=$19
  19 | UnaryExpression op='abs' operand=$20
  20 | IdentifierExpression name='dozen' referent=$2`

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
