import assert from "assert"
import util from "util"
import parse from "../src/parser.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = `   1 | Program statements=[$2,$6,$9,$13]
   2 | Variable name='dozen' initializer=$3
   3 | BinaryExpression op='*' left=1 right=$4
   4 | BinaryExpression op='+' left=0 right=$5
   5 | UnaryExpression op='sqrt' operand=101.3
   6 | Variable name='y' initializer=$7
   7 | BinaryExpression op='-' left=$8 right=0
   8 | IdentifierExpression name='dozen'
   9 | Assignment target=$10 source=$11
  10 | IdentifierExpression name='dozen'
  11 | BinaryExpression op='/' left=0 right=$12
  12 | IdentifierExpression name='y'
  13 | PrintStatement argument=$14
  14 | UnaryExpression op='abs' operand=$15
  15 | IdentifierExpression name='dozen'`

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
