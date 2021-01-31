// Optimizer
//
// This module exports a single function to perform machine-independent
// optimizations on the analyzed semantic graph.
//
// The only optimizations supported here are:
//
//   - assignments to self (x = x) turn into no-ops
//   - constant folding
//   - some strength reductions (+0, -0, *0, *1, etc.)

import { IdentifierExpression, UnaryExpression } from "./ast.js"

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
    if (e.left.constructor === Number) {
      if (e.right.constructor === Number) {
        if (e.op == "+") {
          return e.left + e.right
        } else if (e.op == "-") {
          return e.left - e.right
        } else if (e.op == "*") {
          return e.left * e.right
        } else if (e.op == "/") {
          return e.left / e.right
        }
      } else if (e.left === 0 && e.op === "+") {
        return e.right
      } else if (e.left === 1 && e.op === "*") {
        return e.right
      } else if (e.left === 0 && e.op === "-") {
        return new UnaryExpression("-", e.right)
      } else if (e.left === 0 && e.op === "*") {
        return 0
      } else if (e.left === 0 && e.op === "/") {
        return 0
      }
    } else if (e.right.constructor === Number) {
      if (["+", "-"].includes(e.op) && e.right === 0) {
        return e.left
      } else if (["*", "/"].includes(e.op) && e.right === 1) {
        return e.left
      } else if (e.op === "*" && e.right === 0) {
        return 0
      }
    }
    return e
  },
  UnaryExpression(e) {
    e.operand = optimize(e.operand)
    if (e.operand.constructor === Number) {
      if (e.op === "-") {
        return -e.operand
      } else if (e.op === "abs") {
        return Math.abs(e.operand)
      } else if (e.op === "sqrt") {
        return Math.sqrt(e.operand)
      }
    }
    return e
  },
  IdentifierExpression(e) {
    return e
  },
  Number(e) {
    return e
  },
  Array(a) {
    return a.flatMap(optimize).filter(s => s !== null)
  },
}
