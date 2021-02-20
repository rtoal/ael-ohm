import assert from "assert"
import util from "util"
import parse from "../src/parser.js"

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = `   1 | Program statements=[#2,#6,#9,#13]
   2 | VariableDeclaration name='dozen' initializer=#3
   3 | BinaryExpression op='*' left=1 right=#4
   4 | BinaryExpression op='+' left=0 right=#5
   5 | UnaryExpression op='sqrt' operand=101.3
   6 | VariableDeclaration name='y' initializer=#7
   7 | BinaryExpression op='-' left=#8 right=0
   8 | IdentifierExpression name='dozen'
   9 | Assignment target=#10 source=#11
  10 | IdentifierExpression name='dozen'
  11 | BinaryExpression op='/' left=0 right=#12
  12 | IdentifierExpression name='y'
  13 | PrintStatement argument=#14
  14 | UnaryExpression op='abs' operand=#15
  15 | IdentifierExpression name='dozen'`

const syntaxChecks = [
  ["all numeric literal forms", "print 8 * 89.123"],
  ["complex expressions", "print 83 * ((((((((-13 / 21)))))))) + 1 - -0"],
  ["end of program inside comment", "print 0 // yay"],
  ["comments with no text", "print 1//\nprint 0//"],
  ["non-Latin letters in identifiers", "let コンパイラ = 100"],
]

const syntaxErrors = [
  ["non-letter in an identifier", "let ab😭c = 2", /Line 1, col 7:/],
  ["malformed number", "let x= 2.", /Line 1, col 10:/],
  ["a missing right operand", "print 5 -", /Line 1, col 10:/],
  ["a non-operator", "print 7 * ((2 _ 3)", /Line 1, col 15:/],
  ["an expression starting with a )", "print )", /Line 1, col 7:/],
  ["a statement starting with expression", "x * 5", /Line 1, col 3:/],
  ["an illegal statement on line 2", "print 5\nx * 5", /Line 2, col 3:/],
  ["a statement starting with a )", "print 5\n) * 5", /Line 2, col 1:/],
  ["an expression starting with a *", "let x = * 71", /Line 1, col 9:/],
]

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`recognizes that ${scenario}`, () => {
      assert(parse(source))
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => parse(source), errorMessagePattern)
    })
  }
  it("produces the expected AST for all node types", () => {
    assert.deepStrictEqual(util.format(parse(source)), expectedAst)
  })
})
