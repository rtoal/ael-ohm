import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"

const binaryOptimizationFixture = [
  ["folds +", "print 8 + 5", "print 13"],
  ["folds -", "print 8 - 5", "print 3"],
  ["folds *", "print 8 * 5", "print 40"],
  ["folds /", "print 8 / 5", "print 1.6"],
  ["optimizes -0", "let x = 8\nprint x - 0", "let x = 8\nprint x"],
  ["optimizes +0", "let x = 8\nprint x + 0", "let x = 8\nprint x"],
  ["optimizes *1", "let x = 8\nprint x * 1", "let x = 8\nprint x"],
  ["optimizes /1", "let x = 8\nprint x / 1", "let x = 8\nprint x"],
  ["optimizes *0", "let x = 8\nprint x * 0", "let x = 8\nprint 0"],
  ["optimizes 0*", "let x = 8\nprint 0 * x", "let x = 8\nprint 0"],
  ["optimizes 0/", "let x = 8\nprint 0 / x", "let x = 8\nprint 0"],
  ["optimizes 0-", "let x = 8\nprint 0 - x", "let x = 8\nprint -x"],
  ["optimizes 0+", "let x = 8\nprint 0 + x", "let x = 8\nprint x"],
  ["optimizes 1*", "let x = 8\nprint 1 * x", "let x = 8\nprint x"],
]

const unaryOptimizationFixture = [
  ["folds abs for negatives", "print abs(-5)", "print 5"],
  ["folds abs for positive", "print abs(8)", "print 8"],
  ["folds sqrt", "print sqrt 2.25", "print 1.5"],
]

const statementOptimizationFixture = [
  ["removes x=x at end", "let x = 0\nx = x", "let x = 0"],
  ["removes x=x in middle", "let x = 0\nx = x\nprint x", "let x = 0\nprint x"],
]

// We have to test that non-optimizable constructs are left unchanged!
const nothingToOptimzeFixture = [
  [
    "passes through nonoptimizable constructs",
    ...Array(2).fill("let x=0\nlet y=9\nx=y*abs x"),
  ],
]

describe("The optimzer", () => {
  for (const fixture of [
    binaryOptimizationFixture,
    unaryOptimizationFixture,
    statementOptimizationFixture,
    nothingToOptimzeFixture,
  ]) {
    for (const [scenario, before, after] of fixture) {
      it(`${scenario}`, done => {
        const actual = util.format(optimize(analyze(parse(before))))
        const expected = util.format(analyze(parse(after)))
        assert.deepStrictEqual(actual, expected)
        done()
      })
    }
  }
})
