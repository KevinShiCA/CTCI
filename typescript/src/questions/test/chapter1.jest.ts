import {
  isUnique,
  isUniqueBits,
  isPermutation,
  urlify,
  isPermutationOfPalindrome,
  isPermutationOfPalindromBits,
  oneEditAway,
  rotateMatrix,
  compressString,
  transformMatrixZeros,
  isRotation
} from "../chapter1";

describe("Chapter 1: Arrays and Strings", () => {
  // 1.1 Is Unique
  it("should check if a string contains all unique characters", () => {
    const str1 = "abcdef";
    const str2 = "abbba";
    const str3 = "abbcdef";
    const str4 = "abcdefghijklmnopqrstuvwxyza";
    expect(isUnique(str1)).toBeTruthy();
    expect(isUnique(str2)).toBeFalsy();
    expect(isUnique(str3)).toBeFalsy();
    expect(isUnique(str4)).toBeFalsy();
    expect(isUniqueBits(str1)).toBeTruthy();
    expect(isUniqueBits(str2)).toBeFalsy();
    expect(isUniqueBits(str3)).toBeFalsy();
    expect(isUniqueBits(str4)).toBeFalsy();
  });

  // 1.2 Check Permutations
  it("should check if two strings are permutations of eachother", () => {
    let str1 = "abcdefg";
    let str2 = "gbdafce";
    expect(isPermutation(str1, str2)).toBeTruthy();

    str1 = "abcdefh";
    expect(isPermutation(str1, str2)).toBeFalsy();

    str2 = "abcdefgh";
    expect(isPermutation(str1, str2)).toBeFalsy();

    str1 = "aaabcdef";
    expect(isPermutation(str1, str2)).toBeFalsy();

    str2 = "aaaaabcd";
    expect(isPermutation(str1, str2)).toBeFalsy();
  });

  // 1.3 URLify
  it("should replace all spaces in a c-style string with '%20'", () => {
    let str = ["H", "e", " ", "l", "l", " ", "o", " ", " ", " ", " "];
    const trueLength = 7;
    urlify(str, trueLength);
    expect(str).toEqual(["H", "e", "%", "2", "0", "l", "l", "%", "2", "0", "o"]);

    str = ["H", "e", " ", "l", "l", " ", "o", " ", " ", " ", " ", " ", " ", " ", " "];
    urlify(str, trueLength);
    expect(str).toEqual(["H", "e", "%", "2", "0", "l", "l", "%", "2", "0", "o", " ", " ", " ", " "]);
  });

  // 1.4 Palindrome Permutation
  it("should check if a string is a permutation of a palindrome", () => {
    let str = "Abc D CBA";
    expect(isPermutationOfPalindrome(str)).toBeTruthy();
    expect(isPermutationOfPalindromBits(str)).toBeTruthy();

    str = "abcdcbaa";
    expect(isPermutationOfPalindrome(str)).toBeFalsy();
    expect(isPermutationOfPalindromBits(str)).toBeFalsy();

    str = "abcdefg";
    expect(isPermutationOfPalindrome(str)).toBeFalsy();
    expect(isPermutationOfPalindromBits(str)).toBeFalsy();
  });

  // 1.5 One Edit Away
  it("should check if two strings are one edit away from each other", () => {
    let str1 = "pale";
    let str2 = "ple";
    expect(oneEditAway(str1, str2)).toBeTruthy();
    expect(oneEditAway(str2, str1)).toBeTruthy();

    str1 = "pales";
    str2 = "pale";
    expect(oneEditAway(str1, str2)).toBeTruthy();
    expect(oneEditAway(str2, str1)).toBeTruthy();

    str1 = "pales";
    str2 = "bales";
    expect(oneEditAway(str1, str2)).toBeTruthy();
    expect(oneEditAway(str2, str1)).toBeTruthy();

    str1 = "pales";
    str2 = "bale";
    expect(oneEditAway(str1, str2)).toBeFalsy();
    expect(oneEditAway(str2, str1)).toBeFalsy();

    str1 = "abcd";
    str2 = "abcdef";
    expect(oneEditAway(str1, str2)).toBeFalsy();
    expect(oneEditAway(str2, str1)).toBeFalsy();
  });

  // 1.6 String Compression
  it("should compress strings when appropriate", () => {
    let str = "aaaabccdddefff";
    expect(compressString(str)).toBe("a4b1c2d3e1f3");

    str = "aabbccdddee";
    expect(compressString(str)).toBe("a2b2c2d3e2");

    str = "aaaaaaaaaaaabcde";
    expect(compressString(str)).toBe("a12b1c1d1e1");

    str = "aabbccdde";
    expect(compressString(str)).toBe("aabbccdde");
  });

  // 1.7 Rotate Matrix
  it("should rotate the matrix clockwise by 90 degrees", () => {
    const matrix = [
      [1,  2,  4,  3],
      [5,  6,  8,  7],
      [13, 14, 16, 15],
      [9,  10, 12, 11]
    ];
    rotateMatrix(matrix);
    expect(matrix).toEqual([
      [9,  13, 5, 1],
      [10, 14, 6, 2],
      [12, 16, 8, 4],
      [11, 15, 7, 3]
    ]);
  });

  // 1.8 Zero Matrix
  it("should transform the matrix with zeros", () => {
    const matrix = [
      [1, 1, 0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ];
    transformMatrixZeros(matrix);
    expect(matrix).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0, 1, 0]
    ]);
  });

  // 1.9 String Rotation
  it("should check if one string is a rotation of another", () => {
    let str1 = "helloworld";
    let str2 = "orldhellow";
    expect(isRotation(str1, str2)).toBeTruthy();

    str1 = "hellowrold";
    expect(isRotation(str1, str2)).toBeFalsy();

    str1 = "helloworldh";
    expect(isRotation(str1, str2)).toBeFalsy();

    str2 = "hhelloworld";
    expect(isRotation(str1, str2)).toBeTruthy();
  });
});
