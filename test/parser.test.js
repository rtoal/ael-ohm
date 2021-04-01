import assert from "assert"
import parse from "../src/parser.js"
import * as ast from "../src/ast.js"

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

const source = `let dozen = 1 * (0 + sqrt 101.3)
  let y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  print abs dozen //`

const expectedAst = new ast.Program([
  new ast.VariableDeclaration(
    "dozen",
    new ast.BinaryExpression(
      "*",
      1,
      new ast.BinaryExpression("+", 0, new ast.UnaryExpression("sqrt", 101.3))
    )
  ),
  new ast.VariableDeclaration(
    "y",
    new ast.BinaryExpression("-", Symbol.for("dozen"), 0)
  ),
  new ast.Assignment(
    Symbol.for("dozen"),
    new ast.BinaryExpression("/", 0, Symbol.for("y"))
  ),
  new ast.PrintStatement(new ast.UnaryExpression("abs", Symbol.for("dozen"))),
])

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
    assert.deepStrictEqual(parse(source), expectedAst)
  })
})
