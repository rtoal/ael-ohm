import assert from "assert"
import util from "util"
import parse from "../src/parser.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = `   1 | Program statements=[$2,$9,$13,$18]
   2 | Variable name='dozen' initializer=$3
   3 | BinaryExpression op='*' left=$4 right=$5
   4 | Literal value=1
   5 | BinaryExpression op='+' left=$6 right=$7
   6 | Literal value=0
   7 | UnaryExpression op='sqrt' operand=$8
   8 | Literal value=101.3
   9 | Variable name='y' initializer=$10
  10 | BinaryExpression op='-' left=$11 right=$12
  11 | IdentifierExpression name='dozen'
  12 | Literal value=0
  13 | Assignment target=$14 source=$15
  14 | IdentifierExpression name='dozen'
  15 | BinaryExpression op='/' left=$16 right=$17
  16 | Literal value=0
  17 | IdentifierExpression name='y'
  18 | PrintStatement argument=$19
  19 | UnaryExpression op='abs' operand=$20
  20 | IdentifierExpression name='dozen'`

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
