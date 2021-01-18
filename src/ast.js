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
  let nodeId = 0

  function* prettiedSubtree(node, prefix, indent = 0) {
    seen.set(node, ++nodeId)
    let descriptor = `${" ".repeat(indent)}${prefix}: ${node.constructor.name}`
    let [simpleProps, complexProps] = ["", []]
    for (const [prop, child] of Object.entries(node)) {
      if (seen.has(child)) {
        simpleProps += ` ${prop}=$${seen.get(child)}`
      } else if (Array.isArray(child) || (child && typeof child == "object")) {
        complexProps.push([prop, child])
      } else {
        simpleProps += ` ${prop}=${util.inspect(child)}`
      }
    }
    yield `${String(nodeId).padStart(4, " ")} | ${descriptor}${simpleProps}`
    for (let [prop, child] of complexProps) {
      if (Array.isArray(child)) {
        for (let [index, node] of child.entries()) {
          yield* prettiedSubtree(node, `${prop}[${index}]`, indent + 2)
        }
      } else {
        yield* prettiedSubtree(child, prop, indent + 2)
      }
    }
  }

  return [...prettiedSubtree(node, "program")].join("\n")
}
