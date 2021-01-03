// Optimizer
//
// This module exports a single funciton to perform machine-independent
// optimizations on the analyzed semantic graph.
//
// The only optimizations supported here are:
//
//   - assignments to self turn into no-ops
//   - constant folding
//   - some strength reductions (+0, -0, *0, *1, etc.)

import {
  IdentifierExpression,
  LiteralExpression,
  UnaryExpression,
} from "./ast.js"

export default function optimize(node) {
  return optimizers[node.constructor.name](node)
}

const optimizers = {
  Program(p) {
    p.statements = p.statements.map(optimize).filter(s => s !== null)
    return p
  },
  Declaration(d) {
    d.initializer = optimize(d.initializer)
    return d
  },
  Assignment(s) {
    s.source = optimize(s.source)
    s.target = optimize(s.target)
    if (s.target.constructor == IdentifierExpression) {
      if (s.source.ref === s.target.ref) {
        return null
      }
    }
    return s
  },
  PrintStatement(s) {
    s.expression = optimize(s.expression)
    return s
  },
  BinaryExpression(e) {
    e.left = optimize(e.left)
    e.right = optimize(e.right)
    if (e.left.constructor === LiteralExpression) {
      const x = e.left.value
      if (e.right.constructor === LiteralExpression) {
        const y = e.right.value
        if (e.op == "+") {
          return new LiteralExpression(x + y)
        } else if (e.op == "-") {
          return new LiteralExpression(x - y)
        } else if (e.op == "*") {
          return new LiteralExpression(x * y)
        } else if (e.op == "/") {
          return new LiteralExpression(x / y)
        }
      } else if (x === 0 && e.op === "+") {
        return e.right
      } else if (x === 1 && e.op === "*") {
        return e.right
      } else if (x === 0 && e.op === "-") {
        return new UnaryExpression("-", e.right)
      } else if (x === 0 && e.op === "*") {
        return new LiteralExpression(0)
      } else if (x === 0 && e.op === "/") {
        return new LiteralExpression(0)
      }
    } else if (e.right.constructor === LiteralExpression) {
      const y = e.right.value
      if (["+", "-"].includes(e.op) && y === 0) {
        return e.left
      } else if (["*", "/"].includes(e.op) && y === 1) {
        return e.left
      } else if (e.op === "*" && y === 0) {
        return new LiteralExpression(0)
      }
    }
    return e
  },
  UnaryExpression(e) {
    e.operand = optimize(e.operand)
    if (e.operand.constructor === LiteralExpression) {
      const x = e.operand.value
      if (e.op === "-") {
        return new LiteralExpression(-x)
      } else if (e.op === "abs") {
        return new LiteralExpression(Math.abs(x))
      } else if (e.op === "sqrt") {
        return new LiteralExpression(Math.sqrt(x))
      }
    }
    return e
  },
  IdentifierExpression(e) {
    return e
  },
  LiteralExpression(e) {
    return e
  },
}
