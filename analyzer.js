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
    // In real life, contexts are much larger than just a table: they would
    // also record the current function or module, whether you were in a
    // loop (for validating breaks and continues), and have a reference to
    // the parent contxt (to do static scope analysis) among other things.
    this.locals = new Map()
  }
  addVariable(name, variable) {
    if (this.locals.has(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.locals.set(name, variable)
  }
  lookupVariable(name) {
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

const analyzers = {
  Program(self, context) {
    for (const s of self.statements) {
      analyze(s, context)
    }
  },
  Declaration(self, context) {
    analyze(self.initializer, context)
    context.addVariable(self.name, self, context)
  },
  Assignment(self, context) {
    analyze(self.source, context)
    analyze(self.target, context)
  },
  PrintStatement(self, context) {
    analyze(self.expression, context)
  },
  BinaryExpression(self, context) {
    analyze(self.left, context)
    analyze(self.right, context)
  },
  UnaryExpression(self, context) {
    analyze(self.operand, context)
  },
  IdentifierExpression(self, context) {
    // All identifiers must already be declared
    self.ref = context.lookupVariable(self.name)
  },
  LiteralExpression(self, context) {},
}
