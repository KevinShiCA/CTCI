#See chapter1.ts for problem descriptions.

# IsUnique returns true if the string contains only unique characters.
# Time: O(n), max 26 iterations
# Space: O(n), max 26 map entries.
def IsUnique(string):
    charDict = set()
    for char in string:
        if char not in charDict:
            charDict.add(char)
        else:
            return False
    return True
