![Logo](https://raw.githubusercontent.com/rtoal/ael/main/docs/ael.png)

# Ael

This is a compiler for the language **Ael** written with the help of the amazing Ohm language library.

Ael stands for (A)rithmetic (E)xpression (L)anguage. It’s the language of arithmetic expressions with `+`, `-`, `*`, `/`, `abs`, `sqrt`, and parentheses, together with declarations, assignments, and print statements. The idea is to give the language _just enough_ to (1) illustrate the difference between statements and expressions, (2) have something to do during semantic analysis, and (3) allow for more than one optimization.

In the spirit of an introductory tutorial, this compiler features multiple backends: it can generate JavaScript, C, and LLVM. Why not assembly? Well, LLVM these days takes things plenty far enough along for an introductory example.

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

The compiler is written in modern Python. You will need version 3.8 or above.

Because this application was written as a tutorial, the compiler exposes what each phase does, as well as providing multiple translations:

```
./aelc <filename> <output_type>
```

The output type argument tells the compiler what to print to standard output:

- `tokens` &nbsp;&nbsp; the token sequence
- `ast` &nbsp;&nbsp; the abstract syntax tree
- `analyzed` &nbsp;&nbsp; the semantically analyzed representation
- `optimized` &nbsp;&nbsp; the optimized semantically analyzed representation
- `js` &nbsp;&nbsp; the translation to JavaScript
- `c` &nbsp;&nbsp; the translation to C
- `llvm` &nbsp;&nbsp; the translation to LLVM

To keep things simple, the compiler will halt on the first error it finds.

## Contributing

I’m happy to take PRs. As usual, be nice when filing issues and contributing. Do remember the idea is to keep the language tiny; if you’d like to extend the language, you’re probably better forking into a new project. However, I would _love_ to see any improvements you might have for the implementation or the pedagogy.

When developing, you can run tests with:

```
coverage run --source ael -m pytest tests && coverage report -m
```
