package structures_test

import (
	"testing"

	"../structures"
)

func TestTrie(t *testing.T) {
	trie := &structures.Trie{}

	trie.Insert("hello")
	trie.Insert("hey")
	testValidateWord(trie, "hello", true, t)
	testValidateWord(trie, "hey", true, t)
	testValidateWord(trie, "hell", false, t)
	testTrieSize(trie, 6, t)
	trie.Clear()
	if !trie.IsEmpty() {
		t.Error("Trie should be empty")
	}

	trie.InsertAll([]string{"the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog"})
	testValidatePrefix(trie, "qui", true, t)
	testValidatePrefix(trie, "l", true, t)
	testValidatePrefix(trie, "dog", true, t)
	testValidatePrefix(trie, "asdf", false, t)

	trie.Clear()
	err := trie.Insert("hello")
	testError(err, t)
	err = trie.Insert("hello")
	if err == nil {
		t.Error("Trie should have thrown error, world hello already exists")
	}
	err = trie.Insert("he")
	testError(err, t)
	testValidateWord(trie, "hello", true, t)
	testValidateWord(trie, "he", true, t)
	testValidateWord(trie, "hel", false, t)
	testValidateWord(trie, "asdf", false, t)

	testInsertInvalidWord(trie, "hello world", t)
	testInsertInvalidWord(trie, "hello        world", t)
	testInsertInvalidWord(trie, " helloworld ", t)
	testInsertInvalidWord(trie, "  ", t)
}

func testInsertInvalidWord(trie *structures.Trie, word string, t *testing.T) {
	err := trie.Insert(word)
	if err == nil {
		t.Error("Trie should have thrown error, inserting invalid word: " + word)
	}
}

func testValidateWord(trie *structures.Trie, word string, expected bool, t *testing.T) {
	result := trie.ValidateWord(word)
	if result != expected {
		t.Error("Validate word failed: " + word)
	}
}

func testValidatePrefix(trie *structures.Trie, prefix string, expected bool, t *testing.T) {
	result := trie.ValidatePrefix(prefix)
	if result != expected {
		t.Error("Validate prefix failed: " + prefix)
	}
}

func testTrieSize(trie *structures.Trie, expected int, t *testing.T) {
	if trie.Size() != expected {
		t.Errorf("Trie size should be %d, got %d", expected, trie.Size())
	}
}
