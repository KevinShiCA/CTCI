
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