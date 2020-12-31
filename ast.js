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
    let [simple_props, complex_props] = ["", []]
    for (const [prop, child] of Object.entries(node)) {
      if (seen.has(child)) {
        simple_props += ` ${prop}=${seen.get(child)}`
      } else if (Array.isArray(child) || (child && typeof child == "object")) {
        complex_props.push([prop, child])
      } else {
        simple_props += ` ${prop}=${util.inspect(child)}`
      }
    }
    lines.push(
      `${String(nodeId).padStart(4, " ")} | ${descriptor}${simple_props}`
    )
    for (let [prop, child] of complex_props) {
      if (Array.isArray(child)) {
        for (let [index, node] of child.entries()) {
          subtree_text(node, `${prop}[${index}]`, indent + 2)
        }
      } else {
        subtree_text(child, prop, indent + 2)
      }
    }
  }

  subtree_text(node, "program", 0)
  return lines.join("\n")
}
