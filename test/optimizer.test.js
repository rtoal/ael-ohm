import assert from "assert"
import optimize from "../src/optimizer.js"
import * as ast from "../src/ast.js"

// Make some test cases easier to read
const x = new ast.Variable("x")
const print1 = new ast.PrintStatement(1)

const tests = [
  ["folds +", new ast.BinaryExpression("+", 5, 8), 13],
  ["folds -", new ast.BinaryExpression("-", 5, 8), -3],
  ["folds *", new ast.BinaryExpression("*", 5, 8), 40],
  ["folds /", new ast.BinaryExpression("/", 5, 8), 0.625],
  ["optimizes +0", new ast.BinaryExpression("+", x, 0), x],
  ["optimizes -0", new ast.BinaryExpression("-", x, 0), x],
  ["optimizes *1", new ast.BinaryExpression("*", x, 1), x],
  ["optimizes /1", new ast.BinaryExpression("/", x, 1), x],
  ["optimizes *0", new ast.BinaryExpression("*", x, 0), 0],
  ["optimizes 0*", new ast.BinaryExpression("*", 0, x), 0],
  ["optimizes 0/", new ast.BinaryExpression("/", 0, x), 0],
  ["optimizes 0+", new ast.BinaryExpression("+", 0, x), x],
  [
    "optimizes 0-",
    new ast.BinaryExpression("-", 0, x),
    new ast.UnaryExpression("-", x),
  ],
  ["optimizes 1*", new ast.BinaryExpression("*", 1, x), x],
  ["folds negation", new ast.UnaryExpression("-", 8), -8],
  ["folds abs for negatives", new ast.UnaryExpression("abs", -5), 5],
  ["folds abs for positive", new ast.UnaryExpression("abs", 8), 8],
  ["folds sqrt", new ast.UnaryExpression("sqrt", 2.25), 1.5],
  ["removes x=x at beginning", [new ast.Assignment(x, x), print1], [print1]],
  ["removes x=x at end", [print1, new ast.Assignment(x, x)], [print1]],
  [
    "removes x=x in middle",
    [print1, new ast.Assignment(x, x), print1],
    [print1, print1],
  ],
  [
    "passes through nonoptimizable constructs",
    ...Array(2).fill([
      new ast.VariableDeclaration("x", 0),
      new ast.Assignment(x, new ast.BinaryExpression("*", x, 100)),
    ]),
  ],
]

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepStrictEqual(optimize(before), after)
    })
  }
})
