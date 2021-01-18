// Optimizer
//
// This module exports a single function to perform machine-independent
// optimizations on the analyzed semantic graph.
//
// The only optimizations supported here are:
//
//   - assignments to self turn into no-ops
//   - constant folding
//   - some strength reductions (+0, -0, *0, *1, etc.)

import { Literal, IdentifierExpression, UnaryExpression } from "./ast.js"

export default function optimize(node) {
  return optimizers[node.constructor.name](node)
}

const optimizers = {
  Program(p) {
    p.statements = optimize(p.statements)
    return p
  },
  Variable(v) {
    v.initializer = optimize(v.initializer)
    return v
  },
  Assignment(s) {
    s.source = optimize(s.source)
    s.target = optimize(s.target)
    if (s.target.constructor == IdentifierExpression) {
      if (s.source.referent === s.target.referent) {
        return null
      }
    }
    return s
  },
  PrintStatement(s) {
    s.argument = optimize(s.argument)
    return s
  },
  BinaryExpression(e) {
    e.left = optimize(e.left)
    e.right = optimize(e.right)
    if (e.left.constructor === Literal) {
      const x = e.left.value
      if (e.right.constructor === Literal) {
        const y = e.right.value
        if (e.op == "+") {
          return new Literal(x + y)
        } else if (e.op == "-") {
          return new Literal(x - y)
        } else if (e.op == "*") {
          return new Literal(x * y)
        } else if (e.op == "/") {
          return new Literal(x / y)
        }
      } else if (x === 0 && e.op === "+") {
        return e.right
      } else if (x === 1 && e.op === "*") {
        return e.right
      } else if (x === 0 && e.op === "-") {
        return new UnaryExpression("-", e.right)
      } else if (x === 0 && e.op === "*") {
        return new Literal(0)
      } else if (x === 0 && e.op === "/") {
        return new Literal(0)
      }
    } else if (e.right.constructor === Literal) {
      const y = e.right.value
      if (["+", "-"].includes(e.op) && y === 0) {
        return e.left
      } else if (["*", "/"].includes(e.op) && y === 1) {
        return e.left
      } else if (e.op === "*" && y === 0) {
        return new Literal(0)
      }
    }
    return e
  },
  UnaryExpression(e) {
    e.operand = optimize(e.operand)
    if (e.operand.constructor === Literal) {
      const x = e.operand.value
      if (e.op === "-") {
        return new Literal(-x)
      } else if (e.op === "abs") {
        return new Literal(Math.abs(x))
      } else if (e.op === "sqrt") {
        return new Literal(Math.sqrt(x))
      }
    }
    return e
  },
  IdentifierExpression(e) {
    return e
  },
  Literal(e) {
    return e
  },
  Array(a) {
    return a.flatMap(optimize).filter(s => s !== null)
  },
}
