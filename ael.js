#! /usr/bin/env node

import fs from "fs/promises"
import process from "process"
import compile from "./compiler.js"

const help = `Ael compiler

Syntax: aelc <filename> <output_type>

Prints to stdout according to <output_type>, which must be one of:

  tokens     the token sequence
  ast        the abstract syntax tree
  analyzed   the semantically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
  c          the translation to C
  llvm       the translation to LLVM
`

if (process.argv.length !== 4) {
  console.log(help)
} else {
  fs.readFile(process.argv[2])
    .then(buffer => {
      console.log(compile(buffer.toString(), process.argv[3]))
    })
    .catch(e => {
      console.error("File cannot be read")
    })
}
