
import pytest
from questions import chapter1



def test_chapter_1_question_1():
    test_str_1 = 'abc'
    assert chapter1.is_unique(test_str_1) == True

    test_str_2 = 'cac'
    assert chapter1.is_unique(test_str_2) == False

    test_str_3 = 'asdfghjkl'
    assert chapter1.is_unique(test_str_3) == True

    test_str_4 = ''
    assert chapter1.is_unique(test_str_4) == True

def test_chapter_1_question_2():
    test_str_1_a = 'abc'
    test_str_1_b = 'abc'
    assert chapter1.is_permutation(test_str_1_a,test_str_1_b) == True

    test_str_2_a = ''
    test_str_2_b = 'abc'
    assert chapter1.is_permutation(test_str_2_a,test_str_2_b) == False

    test_str_3_a = 'cab'
    test_str_3_b = 'abc'
    assert chapter1.is_permutation(test_str_3_a,test_str_3_b) == True

    test_str_4_a = 'ccab'
    test_str_4_b = 'cabc'
    assert chapter1.is_permutation(test_str_4_a,test_str_4_b) == True
