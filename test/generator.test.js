import assert from "assert"
import parse from "../parser.js"
import analyze from "../analyzer.js"
import optimize from "../optimizer.js"
import generate from "../generator/index.js"

function dedent(s) {
  return `${s}`.replace(/(\n)\s+/g, "$1").trim()
}

// Ideally there should be a ton of test cases here, right now we don't
// have many. Should have 100% coverage though.

const smallFixture = {
  name: "small",
  source: `
    let x = 3
    x = 5 * sqrt x / x + x - abs x
    print x
  `,
  expected: {
    js: dedent`
      let x_1 = 3;
      x_1 = ((((5 * Math.sqrt(x_1)) / x_1) + x_1) - Math.abs(x_1));
      console.log(x_1);
    `,
    c: dedent`
      #include <stdio.h>
      #include <math.h>
      int main() {
      double x_1 = 3;
      x_1 = ((((5 * sqrt(x_1)) / x_1) + x_1) - fabs(x_1));
      printf("%g\\n", x_1);
      return 0;
      }
    `,
    llvm: dedent`
      @format = private constant [3 x i8] c"%g\\0A"
      declare i64 @printf(i8*, ...)
      declare double @llvm.fabs(double)
      declare double @llvm.sqrt.f64(double)
      define i64 @main() {
      entry:
      %0 = call double @llvm.sqrt.f64(double 3.0)
      %1 = fmul double 5.0, %0
      %2 = fdiv double %1, 3.0
      %3 = fadd double %2, 3.0
      %4 = call double @llvm.fabs(double 3.0)
      %5 = fsub double %3, %4
      call i64 (i8*, ...) @printf(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @format, i64 0, i64 0), double %5)
      ret i64 0
      }
    `,
  },
}

describe("The code generator", () => {
  for (const fixture of [smallFixture]) {
    for (const target of ["js", "c" /* "llvm" */]) {
      it(`produces expected output for the ${fixture.name} program`, done => {
        const intermediate = optimize(analyze(parse(fixture.source)))
        const actual = generate(target)(intermediate)
        assert.deepStrictEqual(actual, fixture.expected[target])
        done()
      })
    }
  }
})
