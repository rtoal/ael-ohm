import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = String.raw`   1 | program: Program
   2 |   statements[0]: Variable name='dozen'
   3 |     initializer: BinaryExpression op='*'
   4 |       left: Literal value=1
   5 |       right: BinaryExpression op='+'
   6 |         left: Literal value=0
   7 |         right: UnaryExpression op='sqrt'
   8 |           operand: Literal value=101.3
   9 |   statements[1]: Variable name='y'
  10 |     initializer: BinaryExpression op='-'
  11 |       left: IdentifierExpression name='dozen' referent=$2
  12 |       right: Literal value=0
  13 |   statements[2]: Assignment
  14 |     target: IdentifierExpression name='dozen' referent=$2
  15 |     source: BinaryExpression op='/'
  16 |       left: Literal value=0
  17 |       right: IdentifierExpression name='y' referent=$9
  18 |   statements[3]: PrintStatement
  19 |     argument: UnaryExpression op='abs'
  20 |       operand: IdentifierExpression name='dozen' referent=$2`

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
