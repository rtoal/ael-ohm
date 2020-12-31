// import pytest
// from ael.analyzer import analyze
// from ael.parser import parse

// def test_analyzer_can_analyze_all_the_nodes():
//     source = """
//        let two = 2-0
//        print(1 * two)
//        two = sqrt 101.3"""
//     assert str(analyze(parse(source))) == """   1 | program: Program
//    2 |   statements[0]: Declaration name='two'
//    3 |     initializer: BinaryExpression op='-'
//    4 |       left: LiteralExpression value=2
//    5 |       right: LiteralExpression value=0
//    6 |   statements[1]: PrintStatement
//    7 |     expression: BinaryExpression op='*'
//    8 |       left: LiteralExpression value=1
//    9 |       right: IdentifierExpression name='two' ref=$2
//   10 |   statements[2]: Assignment
//   11 |     target: IdentifierExpression name='two' ref=$2
//   12 |     source: UnaryExpression op='sqrt'
//   13 |       operand: LiteralExpression value=101.3
// """

// @pytest.mark.parametrize("source, bad", [
//     ("print x", r"Identifier x not declared"),
//     ("let x = 1\nlet x = 1", r"Identifier x already declared")])
// def test_analyzer_can_detect_all_the_errors(source, bad):
//     with pytest.raises(Exception, match=bad):
//         analyze(parse(source))
