// Abstract Syntax Tree Nodes
//
// This module defines classes for the AST nodes. Only the constructors are
// defined here. Semantic analysis methods, optimization methods, and code
// generation are handled by other modules. This keeps the compiler organized
// by phase.

export class Program {
  constructor(statements) {
    this.statements = statements
  }
}

export class VariableDeclaration {
  constructor(name, initializer) {
    Object.assign(this, { name, initializer })
  }
}

export class Variable {
  constructor(name) {
    this.name = name
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
