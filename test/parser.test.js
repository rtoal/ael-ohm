import assert from "assert"
import util from "util"
import parse from "../src/parser.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = `   1 | program: Program
   2 |   statements[0]: Variable name='dozen'
   3 |     initializer: BinaryExpression op='*'
   4 |       left: Literal value=1
   5 |       right: BinaryExpression op='+'
   6 |         left: Literal value=0
   7 |         right: UnaryExpression op='sqrt'
   8 |           operand: Literal value=101.3
   9 |   statements[1]: Variable name='y'
  10 |     initializer: BinaryExpression op='-'
  11 |       left: IdentifierExpression name='dozen'
  12 |       right: Literal value=0
  13 |   statements[2]: Assignment
  14 |     target: IdentifierExpression name='dozen'
  15 |     source: BinaryExpression op='/'
  16 |       left: Literal value=0
  17 |       right: IdentifierExpression name='y'
  18 |   statements[3]: PrintStatement
  19 |     argument: UnaryExpression op='abs'
  20 |       operand: IdentifierExpression name='dozen'`

const errorFixture = [
  ["a missing right operand", "print 5 -", /Line 1, col 10:/],
  ["a non-operator", "print 7 * ((2 _ 3)", /Line 1, col 15:/],
  ["an expression starting with a )", "print )", /Line 1, col 7:/],
  ["a statement starting with expression", "x * 5", /Line 1, col 3:/],
  ["an illegal statement on line 2", "print 5\nx * 5", /Line 2, col 3:/],
  ["a statement starting with a )", "print 5\n) * 5", /Line 2, col 1:/],
  ["an expression starting with a *", "let x = * 71", /Line 1, col 9:/],
]

describe("The parser", () => {
  it("can parse all the nodes", done => {
    assert.deepStrictEqual(util.format(parse(source)), expectedAst)
    done()
  })
  for (const [scenario, source, errorMessagePattern] of errorFixture) {
    it(`throws on ${scenario}`, done => {
      assert.throws(() => parse(source), errorMessagePattern)
      done()
    })
  }
})
