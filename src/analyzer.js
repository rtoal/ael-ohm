// Semantic Analyzer
//
// Analyzes the AST by looking for semantic errors and resolving references.

class Context {
  constructor(context) {
    // Currently, the only analysis context needed is the set of declared
    // variables. We store this as a map, indexed by the variable name,
    // for efficient lookup. More complex languages will a lot more here,
    // such as the current function (to validate return statements), whether
    // you were in a loop (for validating breaks and continues), and a link
    // to a parent context for static scope analysis.
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
  analyze(node) {
    this[node.constructor.name](node)
  }
  Program(p) {
    this.analyze(p.statements)
  }
  Variable(v) {
    this.analyze(v.initializer)
    this.add(v.name, v)
  }
  Assignment(s) {
    this.analyze(s.source)
    this.analyze(s.target)
  }
  PrintStatement(s) {
    this.analyze(s.argument)
  }
  BinaryExpression(e) {
    this.analyze(e.left)
    this.analyze(e.right)
  }
  UnaryExpression(e) {
    this.analyze(e.operand)
  }
  IdentifierExpression(e) {
    // Find out which actual variable is being referred to
    e.referent = this.lookup(e.name)
  }
  Number(e) {
    // Nothing to analyze
  }
  Array(a) {
    a.forEach(entity => this.analyze(entity))
  }
}

export default function analyze(node) {
  new Context().analyze(node)
  return node
}
