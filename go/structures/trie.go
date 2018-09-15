package structures

import (
	"errors"
	"strings"
)

const endOfWord = "END OF WORD"

// TrieNode represents a node in the trie.
type TrieNode struct {
	value    string
	parent   *TrieNode
	children []*TrieNode
}

// Trie holds strings for efficient prefix lookup.
type Trie struct {
	root *TrieNode
	size int
}

// Insert adds a new word to the trie.
func (trie *Trie) Insert(word string) error {
	trie.initialize()
	if strings.ContainsAny(word, " ") {
		return errors.New("Invalid word: " + word)
	}
	letterArray := strings.Split(word, "")
	currentNode := trie.root
	didInsert := false
	for _, letter := range letterArray {
		letterPosition := -1
		for index, child := range currentNode.children {
			if child.value == letter {
				letterPosition = index
				break
			}
		}
		if letterPosition > -1 {
			currentNode = currentNode.children[letterPosition]
		} else {
			newNode := &TrieNode{value: letter, parent: currentNode}
			currentNode.children = append(currentNode.children, newNode)
			currentNode = currentNode.children[len(currentNode.children)-1]
			trie.size++
			didInsert = true
		}
	}
	if didInsert || !findDummy(currentNode.children) {
		dummy := &TrieNode{value: endOfWord}
		currentNode.children = append(currentNode.children, dummy)
		return nil
	}
	return errors.New("Word already exists in trie: " + word)
}

// InsertAll inserts all elements in a slice sequentially.
func (trie *Trie) InsertAll(elems []string) error {
	var e error
	for _, elem := range elems {
		err := trie.Insert(elem)
		if err != nil {
			e = err
		}
	}
	return e
}

// ValidatePrefix returns true if the prefix is in the trie.
func (trie *Trie) ValidatePrefix(prefix string) bool {
	if trie.root == nil {
		return false
	}
	currentNode := trie.root
	letterArray := strings.Split(prefix, "")
	for _, letter := range letterArray {
		letterPosition := -1
		for index, child := range currentNode.children {
			if child.value == letter {
				letterPosition = index
				break
			}
		}
		if letterPosition == -1 {
			return false
		}
		currentNode = currentNode.children[letterPosition]
	}
	return true
}

// ValidateWord returns true if the word is in the trie.
func (trie *Trie) ValidateWord(word string) bool {
	if trie.root == nil {
		return false
	}
	currentNode := trie.root
	letterArray := strings.Split(word, "")
	for _, letter := range letterArray {
		letterPosition := -1
		for index, child := range currentNode.children {
			if child.value == letter {
				letterPosition = index
				break
			}
		}
		if letterPosition == -1 {
			return false
		}
		currentNode = currentNode.children[letterPosition]
	}
	return findDummy(currentNode.children)
}

// Clear removes all nodes in the trie.
func (trie *Trie) Clear() {
	trie.root = nil
	trie.size = 0
}

// Size returns the number of nodes in the trie.
func (trie *Trie) Size() int {
	return trie.size
}

// IsEmpty returns true if the trie has no nodes.
func (trie *Trie) IsEmpty() bool {
	return trie.size == 0
}

func (trie *Trie) initialize() {
	if trie.root == nil {
		trie.root = &TrieNode{value: ""}
		trie.size = 0
	}
}

func findDummy(children []*TrieNode) bool {
	for _, child := range children {
		if child.value == endOfWord {
			return true
		}
	}
	return false
}
