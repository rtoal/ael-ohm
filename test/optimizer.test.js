// import pytest
// from ael.optimizer import optimize
// from ael.analyzer import analyze
// from ael.parser import parse

// @pytest.mark.parametrize("before, after", [
//     ("print 8 + 5", "print 13"),
//     ("print 8 - 5", "print 3"),
//     ("print 8 * 5", "print 40"),
//     ("print 8 / 5", "print 1.6"),
//     ("let x = 8\nprint x - 0", "let x = 8\nprint x"),
//     ("let x = 8\nprint x + 0", "let x = 8\nprint x"),
//     ("let x = 8\nprint x * 1", "let x = 8\nprint x"),
//     ("let x = 8\nprint x / 1", "let x = 8\nprint x"),
//     ("let x = 8\nprint x * 0", "let x = 8\nprint 0"),
//     ("let x = 8\nprint 0 * x", "let x = 8\nprint 0"),
//     ("let x = 8\nprint 0 / x", "let x = 8\nprint 0"),
//     ("let x = 8\nprint 0 - x", "let x = 8\nprint -x"),
//     ("let x = 8\nprint 0 + x", "let x = 8\nprint x"),
//     ("let x = 8\nprint 1 * x", "let x = 8\nprint x")])
// def test_optimizer_optimizes_binary_expressions(before, after):
//     assert str(optimize(analyze(parse(before)))) == str(analyze(parse(after)))

// @pytest.mark.parametrize("before, after", [
//     ("print abs(-5)", "print 5"),
//     ("print abs(8)", "print 8"),
//     ("print sqrt 2.25", "print 1.5")])
// def test_optimizer_optimizes_unary_expressions(before, after):
//     assert str(optimize(analyze(parse(before)))) == str(analyze(parse(after)))

// @pytest.mark.parametrize("before, after", [
//     ("let x = 0\nx = x", "let x = 0"),
//     ("let x = 0\nx = x\nprint x", "let x = 0\nprint x")])
// def test_optimizer_removes_assignments_to_self(before, after):
//     assert str(optimize(analyze(parse(before)))) == str(analyze(parse(after)))

// @pytest.mark.parametrize("source", [
//     "let x = 0\nprint x * 5",
//     "let x = 0\nprint x * 5",
//     "let x = 5\nx = -x"])
// def test_optimizer_passes_through_non_optimizable_constructs(source):
//     assert str(optimize(analyze(parse(source)))) == str(analyze(parse(source)))
