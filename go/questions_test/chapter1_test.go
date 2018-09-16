package questions_test

import (
	"testing"

	"../questions"
)

func TestChapter1(t *testing.T) {
	// 1.1 Is Unique
	str1 := "abcdef"
	str2 := "abbba"
	str3 := "abbcdef"
	str4 := "abcdefghijklmnopqrstuvwxyza"
	testBoolean(questions.IsUnique(str1), true, t)
	testBoolean(questions.IsUnique(str2), false, t)
	testBoolean(questions.IsUnique(str3), false, t)
	testBoolean(questions.IsUnique(str4), false, t)
	testBoolean(questions.IsUniqueBits(str1), true, t)
	testBoolean(questions.IsUniqueBits(str2), false, t)
	testBoolean(questions.IsUniqueBits(str3), false, t)
	testBoolean(questions.IsUniqueBits(str4), false, t)

	// 1.2 Check Permutation
	str1 = "abcdefg"
	str2 = "gbdafce"
	testBoolean(questions.IsPermutation(str1, str2), true, t)
	str1 = "abcdefh"
	testBoolean(questions.IsPermutation(str1, str2), false, t)
	str2 = "abcdefgh"
	testBoolean(questions.IsPermutation(str1, str2), false, t)
	str1 = "aaabcdef"
	testBoolean(questions.IsPermutation(str1, str2), false, t)
	str2 = "aaaaabcd"
	testBoolean(questions.IsPermutation(str1, str2), false, t)

	// 1.3 URLify
	runes := []rune{'H', 'e', ' ', 'l', 'l', ' ', 'o', ' ', ' ', ' ', ' '}
	const trueLength = 7
	questions.URLify(runes, trueLength)
	testArray(runes, []rune{'H', 'e', '%', '2', '0', 'l', 'l', '%', '2', '0', 'o'}, t)

	runes = []rune{'H', 'e', ' ', 'l', 'l', ' ', 'o', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '}
	questions.URLify(runes, trueLength)
	testArray(runes, []rune{'H', 'e', '%', '2', '0', 'l', 'l', '%', '2', '0', 'o', ' ', ' ', ' ', ' '}, t)

	// 1.4 Palindrome Permutation
	str := "Abc D CBA"
	testBoolean(questions.IsPermutationOfPalindrome(str), true, t)
	testBoolean(questions.IsPermutationOfPalindromeBits(str), true, t)
	str = "abcdcbaa"
	testBoolean(questions.IsPermutationOfPalindrome(str), false, t)
	testBoolean(questions.IsPermutationOfPalindromeBits(str), false, t)
	str = "abcdefg"
	testBoolean(questions.IsPermutationOfPalindrome(str), false, t)
	testBoolean(questions.IsPermutationOfPalindromeBits(str), false, t)

	// 1.5 One Edit Away
	str1 = "pale"
	str2 = "ple"
	testBoolean(questions.OneEditAway(str1, str2), true, t)
	testBoolean(questions.OneEditAway(str2, str1), true, t)
	str1 = "pales"
	str2 = "pale"
	testBoolean(questions.OneEditAway(str1, str2), true, t)
	testBoolean(questions.OneEditAway(str2, str1), true, t)
	str1 = "pales"
	str2 = "bales"
	testBoolean(questions.OneEditAway(str1, str2), true, t)
	testBoolean(questions.OneEditAway(str2, str1), true, t)
	str1 = "pales"
	str2 = "bale"
	testBoolean(questions.OneEditAway(str1, str2), false, t)
	testBoolean(questions.OneEditAway(str2, str1), false, t)
	str1 = "abcd"
	str2 = "abcdef"
	testBoolean(questions.OneEditAway(str1, str2), false, t)
	testBoolean(questions.OneEditAway(str2, str1), false, t)

	// 1.6 String Compression
	str = "aaaabccdddefff"
	testString(questions.CompressString(str), "a4b1c2d3e1f3", t)
	str = "aabbccdddee"
	testString(questions.CompressString(str), "a2b2c2d3e2", t)
	str = "aaaaaaaaaaaabcde"
	testString(questions.CompressString(str), "a12b1c1d1e1", t)
	str = "aabbccdde"
	testString(questions.CompressString(str), "aabbccdde", t)

	// 1.7 Rotate Matrix
	matrix := [][]int{
		[]int{1, 2, 4, 3},
		[]int{5, 6, 8, 7},
		[]int{13, 14, 16, 15},
		[]int{9, 10, 12, 11},
	}
	questions.RotateMatrix(matrix)
	testArray(matrix, [][]int{
		[]int{9, 13, 5, 1},
		[]int{10, 14, 6, 2},
		[]int{12, 16, 8, 4},
		[]int{11, 15, 7, 3},
	}, t)

	// 1.8 Zero Matrix
	matrix = [][]int{
		[]int{1, 1, 0, 1, 1, 1, 1, 0},
		[]int{1, 1, 1, 1, 1, 0, 1, 1},
		[]int{1, 1, 1, 1, 1, 1, 1, 1},
		[]int{1, 0, 1, 1, 1, 1, 1, 0},
		[]int{1, 1, 1, 1, 1, 1, 1, 1},
	}
	questions.TransformMatrixZeros(matrix)
	testArray(matrix, [][]int{
		[]int{0, 0, 0, 0, 0, 0, 0, 0},
		[]int{0, 0, 0, 0, 0, 0, 0, 0},
		[]int{1, 0, 0, 1, 1, 0, 1, 0},
		[]int{0, 0, 0, 0, 0, 0, 0, 0},
		[]int{1, 0, 0, 1, 1, 0, 1, 0},
	}, t)

	// 1.9 String Rotation
	str1 = "helloworld"
	str2 = "orldhellow"
	testBoolean(questions.IsRotation(str1, str2), true, t)
	str1 = "hellowrold"
	testBoolean(questions.IsRotation(str1, str2), false, t)
	str1 = "helloworldh"
	testBoolean(questions.IsRotation(str1, str2), false, t)
	str2 = "hhelloworld"
	testBoolean(questions.IsRotation(str1, str2), true, t)
}
