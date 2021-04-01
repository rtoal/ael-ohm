import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

const semanticChecks = [
  ["print declared variable", "let x = 1 print x"],
  ["assign declared variable", "let x = 1 x = x * 5 / (3 + x)"],
]

const semanticErrors = [
  ["redeclarations", "print x", /Identifier x not declared/],
  ["non declared ids", "let x = 1\nlet x = 1", /Identifier x already declared/],
]

const varX = new ast.Variable("x")
const letX1 = Object.assign(new ast.VariableDeclaration("x", 1), {
  variable: varX,
})
const assignX2 = new ast.Assignment(varX, 2)
const graphChecks = [
  ["Variable created & resolved", "let x=1 x=2", [letX1, assignX2]],
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
  for (const [scenario, source, graph] of graphChecks) {
    it(`properly rewrites the AST for ${scenario}`, () => {
      assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
    })
  }
})
