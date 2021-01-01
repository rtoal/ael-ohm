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

class Context {
  constructor(context) {
    // Ael is so simple that the only analysis context needed is the set of
    // declared variables. We store this as a map, indexed by the variable name,
    // for efficient lookup.
    //
    // In real life, contexts are much larger than just a table: they would
    // also record the current function or module, whether you were in a
    // loop (for validating breaks and continues), and have a reference to
    // the parent contxt (to do static scope analysis) among other things.
    this.locals = new Map()
  }
  addDeclaration(variable) {
    if (this.locals.has(variable.name)) {
      throw new Error(`Identifier ${variable.name} already declared`)
    }
    this.locals.set(variable.name, variable)
  }
  lookup(name) {
    const variable = this.locals.get(name)
    if (variable) {
      return variable
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
  Program(p, context) {
    for (const s of p.statements) {
      analyze(s, context)
    }
  },
  Declaration(d, context) {
    analyze(d.initializer, context)
    // Record this variable in the context since we might have to look it up
    context.addDeclaration(d)
  },
  Assignment(s, context) {
    analyze(s.source, context)
    analyze(s.target, context)
  },
  PrintStatement(s, context) {
    analyze(s.expression, context)
  },
  BinaryExpression(e, context) {
    analyze(e.left, context)
    analyze(e.right, context)
  },
  UnaryExpression(e, context) {
    analyze(e.operand, context)
  },
  IdentifierExpression(e, context) {
    // Tag this variable reference with the declaration it references
    e.ref = context.lookup(e.name)
  },
  LiteralExpression(e, context) {
    // There is LITERALly nothing to analyze here (sorry)
  },
}
