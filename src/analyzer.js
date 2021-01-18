// Semantic Analyzer
//
// Analyzes the AST by looking for semantic errors and resolving references. As
// Ael is such a trivial language (with no static types, no loops, no functions,
// no nested scopes), the only semantic errors detected are:
//
//   - redeclaration of an identifier
//   - use of an identifier that has not been declared
//
// Checks are made relative to a semantic context that is passed to the analyzer
// function for each node. Since there is only one "scope" in Ael, there's only
// one context, but in more complex languages things get much more interesting.

import { Variable } from "./ast.js"

class Context {
  constructor(context) {
    // Ael is so simple that the only analysis context needed is the set of
    // declared variables. We store this as a map, indexed by the variable
    // name, for efficient lookup.
    //
    // In real life, contexts are much larger than just a table: they would
    // also record the current function or module, whether you were in a
    // loop (for validating breaks and continues), and have a reference to
    // the parent context (to do static scope analysis) among other things.
    this.locals = new Map()
  }
  add(name, entity) {
    if (this.locals.has(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.locals.set(name, entity)
  }
  lookup(name) {
    const entity = this.locals.get(name)
    if (entity) {
      return entity
    }
    throw new Error(`Identifier ${name} not declared`)
  }
}

export default function analyze(node, context = new Context()) {
  analyzers[node.constructor.name](node, context)
  return node
}

// These are trivial, but only because Ael is so small. Irl, these
// analyzer functions would be filled with type checks, access checks,
// read-only checks, argument checks, and so much more (e.g., is this
// return statement outside of a function? Is this break outside of a
// loop?)
const analyzers = {
  Program(program, context) {
    analyze(program.statements, context)
  },
  Variable(variable, context) {
    analyze(variable.initializer, context)
    // Record this variable in the context since we might have to look it up
    context.add(variable.name, variable)
  },
  Assignment(statement, context) {
    analyze(statement.source, context)
    analyze(statement.target, context)
  },
  PrintStatement(statement, context) {
    analyze(statement.argument, context)
  },
  BinaryExpression(expression, context) {
    analyze(expression.left, context)
    analyze(expression.right, context)
  },
  UnaryExpression(expression, context) {
    analyze(expression.operand, context)
  },
  IdentifierExpression(expression, context) {
    // Tag this variable reference with the declaration it references
    expression.referent = context.lookup(expression.name)
  },
  Literal(expression, context) {
    // There is LITERALly nothing to analyze here
  },
  Array(array, context) {
    array.forEach(entity => analyze(entity, context))
  },
}
