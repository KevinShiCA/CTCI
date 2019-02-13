import pytest
from questions import chapter1

def test_question_1():
    test_str = 'abc'
    assert chapter1.is_unique(test_str) == True

    test_str = 'cac'
    assert chapter1.is_unique(test_str) == False

    test_str = 'asdfghjkl'
    assert chapter1.is_unique(test_str) == True

    test_str = ''
    assert chapter1.is_unique(test_str) == True

def test_question_2():
    test_str_a = 'abc'
    test_str_b = 'abc'
    assert chapter1.is_permutation(test_str_a,test_str_b) == True

    test_str_a = ''
    test_str_b = 'abc'
    assert chapter1.is_permutation(test_str_a,test_str_b) == False

    test_str_a = 'cab'
    test_str_b = 'abc'
    assert chapter1.is_permutation(test_str_a,test_str_b) == True

    test_str_a = 'ccab'
    test_str_b = 'cabc'
    assert chapter1.is_permutation(test_str_a,test_str_b) == True

def test_question_3():
    test_str = 'aabbc'
    assert chapter1.palindrome_permutation(test_str) == True

    test_str = 'abab'
    assert chapter1.palindrome_permutation(test_str) == True

    test_str = 'ab'
    assert chapter1.palindrome_permutation(test_str) == False

    test_str = ''
    assert chapter1.palindrome_permutation(test_str) == True