// Abstract Syntax Tree Nodes
//
// This module defines classes for the AST nodes. Only the constructors are
// defined here. Semantic analysis methods, optimization methods, and code
// generation are handled by other modules. This keeps the compiler organized
// by phase.
//
// The root (Program) node has a custom inspect method, so you can console.log
// the root node and you'll get a lovely formatted string with details on the
// entire AST. It even works well if you analyze the AST and turn it into a
// graph with cycles.

import util from "util"

export class Program {
  constructor(statements) {
    this.statements = statements
  }
  [util.inspect.custom]() {
    return prettied(this)
  }
}

export class Variable {
  constructor(name, initializer) {
    Object.assign(this, { name, initializer })
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class UnaryExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class IdentifierExpression {
  constructor(name) {
    this.name = name
  }
}

export class Literal {
  constructor(value) {
    this.value = value
  }
}

function prettied(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough.
  const seen = new Map()

  function setIds(node) {
    seen.set(node, seen.size + 1)
    for (const child of Object.values(node)) {
      if (seen.has(child)) continue
      else if (Array.isArray(child)) child.forEach(setIds)
      else if (child && typeof child == "object") setIds(child)
    }
  }

  function* lines() {
    for (let [node, id] of [...seen.entries()].sort((a, b) => a[1] - b[1])) {
      let [type, props] = [node.constructor.name, ""]
      for (const [prop, child] of Object.entries(node)) {
        const value = seen.has(child)
          ? `$${seen.get(child)}`
          : Array.isArray(child)
          ? `[${child.map(c => `$${seen.get(c)}`)}]`
          : util.inspect(child)
        props += ` ${prop}=${value}`
      }
      yield `${String(id).padStart(4, " ")} | ${type}${props}`
    }
  }

  setIds(node)
  return [...lines()].join("\n")
}
