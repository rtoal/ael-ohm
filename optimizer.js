// Optimizer
//
// This module exports a single funciton to perform machine independent
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
  Program(self) {
    self.statements = self.statements.map(optimize).filter(s => s !== null)
    return self
  },
  Declaration(self) {
    self.initializer = optimize(self.initializer)
    return self
  },
  Assignment(self) {
    self.source = optimize(self.source)
    self.target = optimize(self.target)
    if (self.target.constructor == IdentifierExpression) {
      if (self.source.ref === self.target.ref) {
        return null
      }
    }
    return self
  },
  PrintStatement(self) {
    self.expression = optimize(self.expression)
    return self
  },
  BinaryExpression(self) {
    self.left = optimize(self.left)
    self.right = optimize(self.right)
    if (self.left.constructor === LiteralExpression) {
      const x = self.left.value
      if (self.right.constructor === LiteralExpression) {
        const y = self.right.value
        if (self.op == "+") {
          return new LiteralExpression(x + y)
        } else if (self.op == "-") {
          return new LiteralExpression(x - y)
        } else if (self.op == "*") {
          return new LiteralExpression(x * y)
        } else if (self.op == "/") {
          return new LiteralExpression(x / y)
        }
      } else if (x === 0 && self.op === "+") {
        return self.right
      } else if (x === 1 && self.op === "*") {
        return self.right
      } else if (x === 0 && self.op === "-") {
        return new UnaryExpression("-", self.right)
      } else if (x === 0 && self.op === "*") {
        return new LiteralExpression(0)
      } else if (x === 0 && self.op === "/") {
        return new LiteralExpression(0)
      }
    } else if (self.right.constructor === LiteralExpression) {
      const y = self.right.value
      if (["+", "-"].includes(self.op) && y === 0) {
        return self.left
      } else if (["*", "/"].includes(self.op) && y === 1) {
        return self.left
      } else if (self.op === "*" && y === 0) {
        return new LiteralExpression(0)
      }
    }
    return self
  },
  UnaryExpression(self) {
    self.operand = optimize(self.operand)
    if (self.operand.constructor === LiteralExpression) {
      const x = self.operand.value
      if (self.op === "-") {
        return new LiteralExpression(-x)
      } else if (self.op === "abs") {
        return new LiteralExpression(Math.abs(x))
      } else if (self.op === "sqrt") {
        return new LiteralExpression(Math.sqrt(x))
      }
    }
    return self
  },
  IdentifierExpression(self) {
    return self
  },
  LiteralExpression(self) {
    return self
  },
}
