// from textwrap import dedent
// from ael.scanner import tokenize
// from ael.parser import parse
// from ael.analyzer import analyze
// from ael.optimizer import optimize
// from ael.generator import generate

// # Ideally there should be a ton of test cases here, right now we don't
// # have many. Should have 100% coverage though.

// small_ael_program = dedent("""\
//     let x = 3
//     x = 5 * sqrt x / x + x - abs x
//     print x
//     """)

// large_ael_program = dedent("""\
//     print 0
//     """)

// small_expected_javascript_program = dedent("""\
//     let x_1 = 3;
//     x_1 = ((((5 * Math.sqrt(x_1)) / x_1) + x_1) - Math.abs(x_1));
//     console.log(x_1);
//     """)

// small_expected_c_program = dedent("""\
//     #include <stdio.h>
//     #include <math.h>
//     int main() {
//     double x_1 = 3;
//     x_1 = ((((5 * sqrt(x_1)) / x_1) + x_1) - fabs(x_1));
//     printf("%g\\n", x_1);
//     return 0;
//     }
//     """)

// small_expected_llvm_program = dedent("""\
//     @format = private constant [3 x i8] c"%g\\0A"
//     declare i64 @printf(i8*, ...)
//     declare double @llvm.fabs(double)
//     declare double @llvm.sqrt.f64(double)
//     define i64 @main() {
//     entry:
//     %0 = call double @llvm.sqrt.f64(double 3.0)
//     %1 = fmul double 5.0, %0
//     %2 = fdiv double %1, 3.0
//     %3 = fadd double %2, 3.0
//     %4 = call double @llvm.fabs(double 3.0)
//     %5 = fsub double %3, %4
//     call i64 (i8*, ...) @printf(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @format, i64 0, i64 0), double %5)
//     ret i64 0
//     }
//     """)

// def test_javascript_generator_works():
//     actual = generate['js'](optimize(analyze(parse(small_ael_program))))
//     assert actual == small_expected_javascript_program

// def test_c_generator_works():
//     actual = generate['c'](optimize(analyze(parse(small_ael_program))))
//     assert actual == small_expected_c_program

// def test_llvm_generator_works():
//     actual = generate['llvm'](optimize(analyze(parse(small_ael_program))))
//     assert actual == small_expected_llvm_program
