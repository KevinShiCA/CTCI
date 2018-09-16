package questions

import (
	"math"
	"strconv"
	"strings"
)

/** See chapter1.ts for problem descriptions. */

// IsUnique returns true if the string contains only unique characters.
// Time: O(n), max 26 iterations.
// Space: O(n), max 26 map entries.
func IsUnique(str string) bool {
	if len(str) > 26 {
		return false
	}
	charMap := make(map[rune]bool)
	for _, char := range str {
		if charMap[char] {
			return false
		}
		charMap[char] = true
	}
	return true
}

// IsUniqueBits implements IsUnique using a bit vector.
// Time: O(n), max 26 iterations.
// Space: O(1).
func IsUniqueBits(str string) bool {
	if len(str) > 26 {
		return false
	}
	bitVector := 0
	for _, char := range str {
		val := uint(char) - uint('a')
		if (bitVector & (1 << val)) > 0 {
			return false
		}
		bitVector = bitVector | (1 << val)
	}
	return true
}

// IsPermutation returns true if one string is a permutation of the other.
// Time: O(n). Space: O(n). O(nlogn) time and O(1) space can be achieved by sorting and comparing.
func IsPermutation(a string, b string) bool {
	if len(a) != len(b) {
		return false
	}
	charMap := make(map[rune]int)
	for _, char := range a {
		// No null check since the default value of an int map is 0.
		charMap[char]++
	}
	for _, char := range b {
		charMap[char]--
		if charMap[char] < 0 {
			return false
		}
	}
	return true
}

// URLify replaces all spaces in a string with "%20".
// Time: O(n). Space: O(1).
func URLify(url []rune, trueLength int) {
	actual := url[:trueLength]
	spaceCount := 0
	for _, char := range actual {
		if char == ' ' {
			spaceCount++
		}
	}
	index := trueLength + spaceCount*2
	for i := trueLength - 1; i >= 0; i-- {
		if url[i] == ' ' {
			url[index-3] = '%'
			url[index-2] = '2'
			url[index-1] = '0'
			index -= 3
		} else {
			url[index-1] = url[i]
			index--
		}
	}
}

// IsPermutationOfPalindrome returns true if the string is the permutation of a palindrome.
// Time: O(n). Space: O(n).
func IsPermutationOfPalindrome(str string) bool {
	normalized := strings.ToLower(str)
	// A palindrome with an even number of letters must have no letters with odd frequencies.
	// A palindrome with an odd number of letters must have exactly one letter with an odd frequency.
	countOdd := 0
	// Contains the frequency of each character in the string.
	charFrequency := make(map[rune]int)
	for _, char := range normalized {
		charFrequency[char]++
		if charFrequency[char]%2 == 1 {
			countOdd++
		} else {
			countOdd--
		}
	}
	return countOdd <= 1
}

// IsPermutationOfPalindromeBits implements the above solution using a bit vector.
// Time: O(n). Space: O(1).
func IsPermutationOfPalindromeBits(str string) bool {
	normalized := strings.ToLower(str)
	// Substitute the frequency map from the previous solution with a bit vector.
	bitVector := 0
	// Toggle the nth bit in a bit vector.
	toggleBit := func(vector int, n uint) int {
		if (vector & (1 << n)) == 0 { // The nth bit is not set.
			return vector | (1 << n) // Set the nth bit.
		}
		return vector & ^(1 << n) // Unset the nth bit.
	}
	for _, char := range normalized {
		bitVector = toggleBit(bitVector, uint(char)-uint('a'))
	}
	// There can be at most one set bit if the string is a palindrome permutation.
	return (bitVector == 0) || ((bitVector & (bitVector - 1)) == 0)
}

// OneEditAway returns true if one string is one character edit away from another.
// Time: O(n). Space: O(1).
func OneEditAway(a string, b string) bool {
	if math.Abs(float64(len(a))-float64(len(b))) > 1 {
		return false
	}
	// Insert and remove can be seen as one operation.
	// Adding one to the shorter string is equivalent to removing the extra from the longer string.
	var shorter, longer string
	if len(a) < len(b) {
		shorter = a
		longer = b
	} else {
		shorter = b
		longer = a
	}
	shorterIndex, longerIndex := 0, 0
	foundEdit := false

	for shorterIndex < len(shorter) && longerIndex < len(longer) {
		if shorter[shorterIndex] != longer[longerIndex] {
			if foundEdit { // Already made an edit.
				return false
			}
			foundEdit = true

			if len(shorter) == len(longer) { // Edit is replacing.
				shorterIndex++
			}
		} else {
			shorterIndex++ // If no edit needed, increment shorter pointer.
		}
		longerIndex++
	}
	return true
}

// CompressString compresses a string using counts of repeated characters.
// If the compressed string is not smaller than the original, then the original is returned.
// Time: O(n). Space: O(1).
func CompressString(str string) string {
	count := 0
	compressed := ""

	for i := 0; i < len(str); i++ {
		count++
		if i+1 >= len(str) || str[i] != str[i+1] {
			compressed += string(str[i]) + strconv.Itoa(count)
			count = 0
		}
	}
	if len(compressed) < len(str) {
		return compressed
	}
	return str
}

// RotateMatrix rotates the contents of an NxN matrix clockwise 90 degrees in place.
// Time: O(N^2). Space: O(1).
func RotateMatrix(matrix [][]int) {
	n := len(matrix)
	for layer := 0; layer < n/2; layer++ {
		first := layer
		last := n - 1 - layer
		for startRotate := first; startRotate < last; startRotate++ {
			offset := startRotate - first
			temp := matrix[first][startRotate]

			// Starting from the left side, rotate clockwise.
			matrix[first][startRotate] = matrix[last-offset][first]
			matrix[last-offset][first] = matrix[last][last-offset]
			matrix[last][last-offset] = matrix[startRotate][last]
			matrix[startRotate][last] = temp
		}
	}
}

// TransformMatrixZeros transforms an MxN (M, N > 0) matrix in place;
// if an element is 0, then that element's entire row and column should be set to 0.
// Time: O(MN). Space: O(M + N).
func TransformMatrixZeros(matrix [][]int) {
	rowFlags := make([]bool, len(matrix))
	columnFlags := make([]bool, len(matrix[0]))

	setRowZeros := func(rowIndex int) {
		for columnIndex := range matrix[0] {
			matrix[rowIndex][columnIndex] = 0
		}
	}
	setColumnZeros := func(columnIndex int) {
		for rowIndex := range matrix {
			matrix[rowIndex][columnIndex] = 0
		}
	}

	for rowIndex, row := range matrix {
		for columnIndex := range matrix[0] {
			if row[columnIndex] == 0 {
				rowFlags[rowIndex] = true
				columnFlags[columnIndex] = true
			}
		}
	}
	for rowIndex, flag := range rowFlags {
		if flag {
			setRowZeros(rowIndex)
		}
	}
	for columnIndex, flag := range columnFlags {
		if flag {
			setColumnZeros(columnIndex)
		}
	}
}

// IsRotation returns true if s1 is a rotation of s2 or vice versa.
// Given a function isSubstring, implement this with only one call to isSubstring.
// Time: O(n), assuming isSubstring has a time complexity of O(n). Space: O(1).
func IsRotation(s1 string, s2 string) bool {
	// Implementation is trivial.
	isSubstring := func(s1 string, s2 string) bool {
		return strings.Contains(s1, s2)
	}
	if len(s1) == len(s2) && len(s1) > 0 {
		return isSubstring(s1+s1, s2)
	}
	return false
}
