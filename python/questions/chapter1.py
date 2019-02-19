
#See chapter1.ts for problem descriptions.

# is_unique returns true if the string contains only unique characters.
# Time: O(n), max 26 iterations
# Space: O(n), max 26 map entries.
def is_unique(string):
    char_dict = set()
    for char in string:
        if char not in char_dict:
            char_dict.add(char)
        else:
            return False
    return True

# is_permutation returns true if one string is a permutation of the other.
# Time: O(n)
# Space: O(n)
def is_permutation(string_a, string_b):
    char_dict = {} 
    for char in string_a:
        if char not in char_dict:
            char_dict[char] = 1
        else:
            char_dict[char] += 1
    for char in string_b:
        if char not in char_dict or char_dict[char] == 0:
            return False
        char_dict[char] -= 1
    return True

# 1.4 Palindrome Permutation: Given a string, write a function to check if it is a permutation of a palindrome.
# Assume that case and whitespace do not matter, and that there will be no leading or trailing whitespaces.
# Assume that only letters of the english alphabet will be used.
# Time: O(n) 
# Space: O(n)
def palindrome_permutation(string):
    char_dict = {}
    for char in string:
        if char not in char_dict:
            char_dict[char] = 1
        else:
            char_dict[char] += 1
    odd_count = 0
    for count in char_dict.values():
        if count%2 == 1:
            odd_count += 1
    return odd_count in {0,1}