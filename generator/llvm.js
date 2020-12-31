"""Code Generator Ael -> LLVM

Invoke generate(program) with the program node to get the LLVM translation
as a string. As this compiler is written totally from scratch, we're not
using any LLVM libraries and we're just writing out LLVM IR as text.
"""

from io import StringIO
from ast import *


def generate(program):
    buffer = StringIO()
    ael_variable_to_llvm = {}
    next_llvm_register = -1

    def new_llvm_local():
        # Variables in LLVM IR are just %0, %1, %2, ...
        nonlocal next_llvm_register
        next_llvm_register += 1
        return f"%{next_llvm_register}"

    def generate(node):
        def emit(line):
            print(line, file=buffer)

        def generateProgram(self):
            emit('@format = private constant [3 x i8] c"%g\\0A"')
            emit("declare i64 @printf(i8*, ...)")
            emit("declare double @llvm.fabs(double)")
            emit("declare double @llvm.sqrt.f64(double)")
            emit("define i64 @main() {")
            emit("entry:")
            for s in self.statements:
                generate(s)
            emit("ret i64 0")
            emit("}")

        def generateDeclaration(self):
            # Ael is such a boring language; since there are no loops or
            # conditions, Ael variables just map to the generated LLVM ones,
            # so it's frighteningly trivial.
            ael_variable_to_llvm[self] = generate(self.initializer)

        def generateAssignment(self):
            # There’s no difference between declarations and assignments here;
            # by this time in the complier, we’ve already checked that
            # assignments refer to already-declared Ael variables. So
            # whatever got computed on the right hand side is what this
            # variable will reference form now on.
            ael_variable_to_llvm[self.target.ref] = generate(self.source)

        def generatePrintStatement(self):
            format = 'i8* getelementptr inbounds ([3 x i8], [3 x i8]* @format, i64 0, i64 0)'
            operand = f'double {generate(self.expression)}'
            emit(f'call i64 (i8*, ...) @printf({format}, {operand})')

        def generateBinaryExpression(self):
            op = {'+': 'fadd', '-': 'fsub', '*': 'fmul', '/': 'fdiv'}[self.op]
            left = generate(self.left)
            right = generate(self.right)
            target = new_llvm_local()
            emit(f'{target} = {op} double {left}, {right}')
            return target

        def generateUnaryExpression(self):
            x = generate(self.operand)
            if self.op == '-':
                source = f'fneg double {x}'
            elif self.op == 'abs':
                source = f'call double @llvm.fabs(double {x})'
            elif self.op == 'sqrt':
                source = f'call double @llvm.sqrt.f64(double {x})'
            target = new_llvm_local()
            emit(f'{target} = {source}')
            return target

        def generateIdentifierExpression(self):
            return ael_variable_to_llvm[self.ref]

        def generateLiteralExpression(self):
            # Glad we're writing this in Python, as this cast gives us the
            # numbers in exactly the format expected by LLVM. So nice.
            return float(self.value)

        return locals()[f"generate{type(node).__name__}"](node)

    generate(program)
    return buffer.getvalue()
