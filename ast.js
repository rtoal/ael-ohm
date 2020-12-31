// Abstract Syntax Tree Nodes
//
// This module defines classes for the AST nodes. Only the constructors are
// defined here. Semantic analysis methods, optimization methods, and code
// generation are handled by other modules. This keeps the compiler organized
// by phase.

import util from "util"

export class Program {
  constructor(statements) {
    this.statements = statements
  }
  [util.inspect.custom]() {
    return text(this)
  }
}

export class Declaration {
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
  constructor(expression) {
    this.expression = expression
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

export class LiteralExpression {
  constructor(value) {
    this.value = value
  }
}

function text(node) {
  // Return a compact but pretty string representation of the node graph,
  // taking care of cycles. Written here from scracth because the built-in
  // stringification function, while nice, isn't nice enough.
  const lines = []
  const seen = new Map()
  let nodeId = 0

  function subtree_text(node, prefix, indent) {
    seen.set(node, ++nodeId)
    let descriptor = `${" ".repeat(indent)}${prefix}: ${node.constructor.name}`
    let [simple_attributes, complex_attributes] = ["", []]
    for (const [attribute, child] of Object.entries(node)) {
      if (seen.has(child)) {
        simple_attributes += ` ${attribute}=${seen.get(child)}`
      } else if (Array.isArray(child) || (child && typeof child == "object")) {
        complex_attributes.push([attribute, child])
      } else {
        simple_attributes += ` ${attribute}=${util.inspect(child)}`
      }
    }
    lines.push(
      `${String(nodeId).padStart(4, " ")} | ${descriptor}${simple_attributes}`
    )
    for (let [attribute, child] of complex_attributes) {
      if (Array.isArray(child)) {
        for (let [index, node] of child.entries()) {
          subtree_text(node, `${attribute}[${index}]`, indent + 2)
        }
      } else {
        subtree_text(child, attribute, indent + 2)
      }
    }
  }

  subtree_text(node, "program", 0)
  return lines.join("\n")
}
