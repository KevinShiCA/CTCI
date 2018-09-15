package structures_test

import (
	"reflect"
	"testing"

	"../structures"
)

func TestHashmap(t *testing.T) {
	hashmap := structures.Hashmap{}

	hashmap.Put("hello", 2)
	value, err := hashmap.Get("hello")
	testError(err, t)
	if value != 2 {
		t.Errorf("Get incorrect, expected 2, got %d", value)
	}

	hashmap.Put("world", 3)
	value, err = hashmap.Get("world")
	testError(err, t)
	if value != 3 {
		t.Errorf("Get incorrect, expected 3, got %d", value)
	}

	if hashmap.Size() != 2 {
		t.Errorf("Size should be 2, got %d", hashmap.Size())
	}

	_, err = hashmap.Get("wrong")
	if err == nil {
		t.Error("Hashmap should throw an error, the key 'wrong' has not been inserted")
	}

	hashmap.Put("the", 5)
	hashmap.Put("the", 4)
	value, err = hashmap.Get("the")
	testError(err, t)
	if value != 4 {
		t.Errorf("Get incorrect, expected 4, got %d", value)
	}

	if !hashmap.ContainsKey("the") {
		t.Error("Hashmap should contain key 'the'")
	}
	if hashmap.ContainsKey("wrong") {
		t.Error("Hashmap should not contain key 'wrong'")
	}

	if !hashmap.ContainsValue(2) {
		t.Error("Hashmap should contain value 2")
	}
	if !hashmap.ContainsValue(4) {
		t.Error("Hashmap should contain value 4")
	}
	if hashmap.ContainsValue(5) {
		t.Error("Hashmap should not contain value 5")
	}

	if !reflect.DeepEqual(hashmap.Values(), []int{2, 3, 4}) {
		t.Error("Map should contain {2, 3, 4}")
	}
}
