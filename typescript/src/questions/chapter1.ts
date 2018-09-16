/**
 * 1.1 Is Unique: Implement an algorithm to determine if a string has all unique characters.
 * Assume only lower case letters can be used.
 * What if you cannot use additional data structures?
 */

/** Time: O(n), max 26 iterations. Space: O(n), max 26 map entries. */
export function isUnique(str: string) {
  if (str.length > 26) {
    return false;
  }
  const charMap: Record<string, boolean> = {};
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (charMap[char]) {
      return false;
    }
    charMap[char] = true;
  }
  return true;
}

/** Time: O(n), max 26 iterations. Space: O(1). */
export function isUniqueBits(str: string) {
  if (str.length > 26) {
    return false;
  }
  // Substitute the charMap from the previous solution with a bit vector, represented by an int.
  let bitVector = 0; // 32 bit in JavaScript.
  for (let i = 0; i < str.length; i++) {
    // Subtract by "a" ASCII code to get a value between 0 and 25.
    const n = str.charCodeAt(i) - "a".charCodeAt(0);
    // 1 << n creates a bit vector where the only 1 bit is the nth bit.
    if ((bitVector & (1 << n)) > 0) { // This can only happen if the nth bit is set in the vector.
      return false;
    }
    bitVector = bitVector | (1 << n); // Set the nth bit in the vector.
  }
  return true;
}

/**
 * 1.2 Check Permutation: Given two strings, write a method to decide if one is a permutation of the other.
 * Assume that case and whitespace are both significant.
 */

/** Time: O(n). Space: O(n). O(nlogn) time and O(1) space can be achieved by sorting and comparing. */
export function isPermutation(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }
  const charMap: Record<string, number> = {};
  [...a].forEach(letter => {
    if (!charMap[letter]) {
      charMap[letter] = 0;
    }
    charMap[letter]++;
  });
  for (let i = 0; i < b.length; i++) {
    const letter = b.charAt(i);
    if (charMap[letter] === undefined) { // Explicitly check for undefined since 0 is a possible value.
      return false;
    }
    charMap[letter]--;
    if (charMap[letter] < 0) {
      return false;
    }
  }
  return true;
}

/**
 * 1.3 URLify: Replace all spaces in a string with "%20".
 * Assume no leading whitespaces.
 * This implementation is trivial in TypeScript, so assume c-style fixed size character arrays.
 * The fixed size char array has enough space for the final url string.
 * The length of the actual string is given by trueLength.
 */

/** Time: O(n). Space: O(1). */
export function urlify(url: string[], trueLength: number) {
  const spaceCount = url.slice(0, trueLength)
    .reduce((acc, letter) => acc + (letter === " " ? 1 : 0), 0);
  let index = trueLength + spaceCount * 2;
  for (let i = trueLength - 1; i >= 0; i--) {
    if (url[i] === " ") {
      url[index - 3] = "%";
      url[index - 2] = "2";
      url[index - 1] = "0";
      index -= 3;
    } else {
      url[index - 1] = url[i];
      index--;
    }
  }
}

/**
 * 1.4 Palindrome Permutation: Given a string, write a function to check if it is a permutation of a palindrome.
 * Assume that case and whitespace do not matter, and that there will be no leading or trailing whitespaces.
 * Assume that only letters of the english alphabet will be used.
 */

/** Time: O(n). Space: O(n), arguably O(1) since the map cannot contain more than 26 entries. */
export function isPermutationOfPalindrome(str: string) {
  const normalized = str.toLowerCase();
  // A palindrome with an even number of letters must have no letters with odd frequencies.
  // A palindrome with an odd number of letters must have exactly one letter with an odd frequency.
  let countOdd = 0;
  // Contains the frequency of each character in the string.
  const charFrequency: Record<string, number> = {};
  [...normalized].forEach(letter => {
    if (!charFrequency[letter]) {
      charFrequency[letter] = 0;
    }
    charFrequency[letter]++;
    if (charFrequency[letter] % 2 === 1) { // Odd frequency for this letter.
      countOdd++;
    } else {
      countOdd--;
    }
  });
  return countOdd <= 1;
}

/**
 * 1.5 One Edit Away: There are three types of edits that can be performed on strings: insert
 * a character, remove a character, or replace a character. Given two strings, write a function
 * to check if they are one or less edits away from eachother.
 *
 * Examples:
 * pale, ple -> true (insert or remove)
 * pales, pale -> true (insert or remove)
 * pale, bale -> true (replace)
 * pale, pac -> false
 */

/** Time: O(n). Space: O(1). */
export function oneEditAway(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) {
    return false;
  }

  // Insert and remove can be seen as one operation.
  // Adding one to the shorter string is equivalent to removing the extra from the longer string.
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  let shorterIndex = 0;
  let longerIndex = 0;
  let foundEdit = false; // This flag can only be flipped once. Return false if flipped again.

  while (shorterIndex < shorter.length && longerIndex < longer.length) {
    if (shorter.charAt(shorterIndex) !== longer.charAt(longerIndex)) { // Edit here.
      if (foundEdit) { // Already made an edit.
        return false;
      }
      foundEdit = true;

      if (shorter.length === longer.length) { // Edit is replacing.
        shorterIndex++;
      }
    } else {
      shorterIndex++; // If no edit needed, increment shorter pointer.
    }
    longerIndex++;
  }
  return true;
}

/**
 * 1.6 String Compression: Implement a function to perform basic string compression using
 * the counts of repeated characters. If the compressed string would not be smaller than
 * the original, return the original instead.
 * Assume that only letters of the english alphabet will be used.
 *
 * Examples:
 * aabbbcddd -> a2b3c1d3
 * aabcde -> aabcde (not a2b1c1d1e1)
 */

/**
 * Time: O(n).
 * Space: O(1). The spread operator is syntactic sugar and does not allocate extra space.
 */
export function compressString(str: string) {
  let count = 0;
  let compressed = "";
  [...str].forEach((letter, index) => {
    count++;
    if (index + 1 >= str.length || letter !== str.charAt(index + 1)) {
      compressed += `${letter}${count}`;
      count = 0;
    }
  });
  return compressed.length < str.length ? compressed : str;
}

/**
 * 1.7 Rotate Matrix: Given an NxN matrix, rotate the contents clockwise 90 degrees in place.
 * Assume the matrix contains integers.
 */

/** Time: O(N^2). Space: O(1). */
export function rotateMatrix(matrix: number[][]) {
  const n = matrix.length;
  for (let layer = 0; layer < n / 2; layer++) {
    const first = layer;
    const last = n - 1 - layer;
    for (let startRotate = first; startRotate < last; startRotate++) {
      const offset = startRotate - first;
      const temp = matrix[first][startRotate];

      // Starting from the left side, rotate clockwise.
      matrix[first][startRotate] = matrix[last - offset][first];
      matrix[last - offset][first] = matrix[last][last - offset];
      matrix[last][last - offset] = matrix[startRotate][last];
      matrix[startRotate][last] = temp;
    }
  }
}

/**
 * 1.8 Zero Matrix: Write a function that transforms a given MxN (M, N > 0) matrix in place;
 * if an element is 0, then that element's entire row and column should be set to 0.
 * Assume that the matrix contains integers only.
 */

/** Time: O(MN). Space: O(M + N). */
export function transformMatrixZeros(matrix: number[][]) {
  const rowFlags = matrix.map(_ => false);
  const columnFlags = matrix[0].map(_ => false);

  const setRowZeros = (rowIndex: number) => {
    matrix[0].forEach((_, columnIndex) => matrix[rowIndex][columnIndex] = 0);
  };
  const setColumnZeros = (columnIndex: number) => {
    matrix.forEach((_, rowIndex) => matrix[rowIndex][columnIndex] = 0);
  };

  matrix.forEach((row, rowIndex) => {
    matrix[0].forEach((_, columnIndex) => {
      if (row[columnIndex] === 0) {
        rowFlags[rowIndex] = true;
        columnFlags[columnIndex] = true;
      }
    });
  });
  rowFlags.forEach((flag, rowIndex) => {
    if (flag) {
      setRowZeros(rowIndex);
    }
  });
  columnFlags.forEach((flag, columnIndex) => {
    if (flag) {
      setColumnZeros(columnIndex);
    }
  });
}

/**
 * 1.9 String Rotation: Given a method isSubstring(s1, s2) which checks if s2 is a substring of
 * s1, write a function that checks if s2 is a rotation of s1 using only one call to isSubstring(s1, s2).
 * Assume that the strings do not contain whitespaces.
 *
 * Example:
 * helloworld is a rotation of orldhellow (and vice versa).
 */

/** Time: O(n), assuming isSubstring has a time complexity of O(n). Space: O(1). */
export function isRotation(s1: string, s2: string) {
  // Implementation is trivial.
  const isSubstring = (s1: string, s2: string) => {
    return s1.includes(s2);
  };
  if (s1.length === s2.length && s1.length > 0) {
    return isSubstring(s1 + s1, s2);
  }
  return false;
}
