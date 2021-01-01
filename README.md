![Logo](https://raw.githubusercontent.com/rtoal/ael/main/docs/ael.png)

# Ael

This is a compiler for the language **Ael** written with the help of the amazing [Ohm language library](https://ohmlang.github.io/).

Ael stands for (A)rithmetic (E)xpression (L)anguage. It’s the language of arithmetic expressions with `+`, `-`, `*`, `/`, `abs`, `sqrt`, and parentheses, together with declarations, assignments, and print statements. The language wants to be _just simple enough_ for the compiler writer to (1) experience the difference between statements and expressions, (2) have something to do during semantic analysis, and (3) provide a handful of optimization opportunities.

In the spirit of an introductory tutorial, this compiler features multiple backends: it can generate JavaScript, C, and LLVM. Why not a real assembly language? It’s fair to say LLVM these days takes things plenty far enough along for an introductory example. One can learn about register allocation and hardware-specific optimizations elsewhere.

## Sample Program

Here is a sample program in the language:

```
let x = 3 * 9
let y = 793 + (2 / abs 80 + x) * x
print 8 * x - (-y)
x = y
print y / sqrt 3
```

## Grammar

Here is the grammar in Ohm notation:

```
  Program   = Statement+
  Statement = let id "=" Exp              --declare
            | id "=" Exp                  --assign
            | print Exp                   --print
  Exp       = Exp ("+" | "-") Term        --binary
            | Term
  Term      = Term ("*"| "/") Factor      --binary
            | Factor
  Factor    = id
            | num
            | "(" Exp ")"                 --parens
            | ("-" | abs | sqrt) Factor   --unary
  num       = digit+ ("." digit+)?
  let       = "let" ~alnum
  print     = "print" ~alnum
  abs       = "abs" ~alnum
  sqrt      = "sqrt" ~alnum
  keyword   = let | print | abs | sqrt
  id        = ~keyword letter alnum*
  space    += "//" (~"\\n" any)* "\\n"    --comment
```

## Running

The compiler is written in modern JavaScript.

Because this application was written as a tutorial, the compiler exposes what each phase does, as well as providing multiple translations:

```
./aelc <filename> <output_type>
```

The output type argument tells the compiler what to print to standard output:

- `ast` &nbsp;&nbsp; the abstract syntax tree
- `analyzed` &nbsp;&nbsp; the semantically analyzed representation
- `optimized` &nbsp;&nbsp; the optimized semantically analyzed representation
- `js` &nbsp;&nbsp; the translation to JavaScript
- `c` &nbsp;&nbsp; the translation to C
- `llvm` &nbsp;&nbsp; the translation to LLVM

To keep things simple, the compiler will halt on the first error it finds.

## Contributing

I’m happy to take PRs. As usual, be nice when filing issues and contributing. Do remember the idea is to keep the language tiny; if you’d like to extend the language, you’re probably better forking into a new project. However, I would _love_ to see any improvements you might have for the implementation or the pedagogy.

To contribute, make sure you have a modern version of Node.js, since the code has some ES2020 features. Clone the repo and run `npm install` as usual.

You can run tests with:

```
npm test
```

This project is so small that `npm test` is configured to always run a coverage report. I used [mocha](https://mochajs.org/) for the test runner and [c8](https://github.com/bcoe/c8) for the coverage. (It was too hard to get Jest working without Babel.)
