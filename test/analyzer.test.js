import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"

const source = `let two = 2 - 0
  print(1 * two)   // TADA 🥑 
  two = sqrt 101.3`

const expectedAst = String.raw`   1 | program: Program
   2 |   statements[0]: VariableDeclaration name='two'
   3 |     initializer: BinaryExpression op='-'
   4 |       left: Literal value=2
   5 |       right: Literal value=0
   6 |     variable: Variable name='two'
   7 |   statements[1]: PrintStatement
   8 |     argument: BinaryExpression op='*'
   9 |       left: Literal value=1
  10 |       right: IdentifierExpression name='two' referent=$6
  11 |   statements[2]: Assignment
  12 |     target: IdentifierExpression name='two' referent=$6
  13 |     source: UnaryExpression op='sqrt'
  14 |       operand: Literal value=101.3`

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
