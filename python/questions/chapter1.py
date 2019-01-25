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
# IsPermutation returns true if one string is a permutation of the other.
# Time: O(n)
# Space: O(n)

def IsPermutation(stringA, stringB):
    charDict = {} 

    for char in stringA:
        if char not in charDict:
            charDict[char] = 1
        else:
            charDict[char]+=1

    for char in stringB:
        if char in charDict:
            if charDict[char] != 0:
                charDict[char]-=1
            else:
                return False
        else:
            return False
    return True
        