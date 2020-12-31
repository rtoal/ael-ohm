// """Code Generator Ael -> JavaScript

// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.
// """

// from io import StringIO
// from ast import *

// def generate(program):
//     buffer = StringIO()
//     target_names = {}
//     next_suffix = 1

//     def target_name(declaration):
//         nonlocal next_suffix
//         if declaration not in target_names:
//             target_names[declaration] = next_suffix
//             next_suffix += 1
//         return f"{declaration.name}_{target_names[declaration]}"

//     def generate(node):
//         def emit(line):
//             print(line, file=buffer)

//         def generateProgram(self):
//             for s in self.statements:
//                 generate(s)

//         def generateDeclaration(self):
//             emit(f"let {target_name(self)} = {generate(self.initializer)};")

//         def generateAssignment(self):
//             self.source = generate(self.source)
//             self.target = generate(self.target)
//             emit(f"{self.target} = {self.source};")

//         def generatePrintStatement(self):
//             emit(f"console.log({generate(self.expression)});")

//         def generateBinaryExpression(self):
//             return f"({generate(self.left)} {self.op} {generate(self.right)})"

//         def generateUnaryExpression(self):
//             op = {'abs': 'Math.abs', 'sqrt': 'Math.sqrt'}.get(self.op, self.op)
//             return f"{op}({generate(self.operand)})"

//         def generateIdentifierExpression(self):
//             return target_name(self.ref)

//         def generateLiteralExpression(self):
//             return self.value

//         return locals()[f"generate{type(node).__name__}"](node)

//     generate(program)
//     return buffer.getvalue()
