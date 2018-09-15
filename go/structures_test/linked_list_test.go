package structures_test

import (
	"reflect"
	"testing"

	"../structures"
)

func TestLinkedList(t *testing.T) {
	ll := structures.LinkedList{}

	// Test Append and Get.
	ll.AppendAll([]int{1, 2, 3, 4, 5})

	value, err := ll.Get(0)
	testError(err, t)
	if value != 1 {
		t.Errorf("Get incorrect, expected 1, got %d", value)
	}

	value, err = ll.Get(2)
	testError(err, t)
	if value != 3 {
		t.Errorf("Get incorrect, expected 3, got %d", value)
	}

	value, err = ll.Get(4)
	testError(err, t)
	if value != 5 {
		t.Errorf("Get incorrect, expected 5, got %d", value)
	}

	value, err = ll.Get(5)
	if err == nil {
		t.Error("Get should throw an error, there is no element at index 5")
	}

	// Test Add. List currently contains [1, 2, 3, 4, 5].
	err = ll.Add(10, 3)
	testError(err, t)
	value, err = ll.Get(3)
	if value != 10 {
		t.Errorf("Add incorrect, 10 should be inserted at index 3, got %d at index 3", value)
	}
	if ll.Size() != 6 {
		t.Errorf("Size should be 6 after adding 10, got %d", ll.Size())
	}
	err = ll.Add(10, 8)
	if err == nil {
		t.Error("Add should throw an error, the list only has 6 elements")
	}
	err = ll.Add(10, -1)
	if err == nil {
		t.Error("Add should throw an error, cannot Add at a negative index")
	}

	// Test Remove. List currently contains [1, 2, 10, 3, 4, 5].
	if !ll.Contains(10) {
		t.Error("List should contain 10, but it does not")
	}
	err = ll.Remove(10)
	testError(err, t)
	if ll.Size() != 5 {
		t.Errorf("Size should be 5 after removing 10, got %d", ll.Size())
	}
	if ll.Contains(10) {
		t.Error("List should not contain 10 after removing, but it does")
	}
	ll.Add(10, 3)
	ll.Append(10)
	value, err = ll.Get(3)
	if value != 10 {
		t.Errorf("Add incorrect, 10 should be inserted at index 3, got %d at index 3", value)
	}
	ll.Remove(10)
	if ll.IndexOf(10) != ll.Size()-1 {
		t.Errorf("10 should be the last element, but it is at index %d", ll.IndexOf(10))
	}
	if ll.Size() != 6 {
		t.Errorf("Size should be 6, got %d", ll.Size())
	}

	// Test RemoveAt. List currently contains [1, 2, 3, 4, 5, 10]
	value, err = ll.RemoveAt(0)
	testError(err, t)
	if value != 1 {
		t.Errorf("Should have removed 1, but removed %d", value)
	}
	value, err = ll.RemoveAt(4)
	testError(err, t)
	if value != 10 {
		t.Errorf("Should have removed 10, but removed %d", value)
	}
	value, err = ll.RemoveAt(2)
	testError(err, t)
	if value != 4 {
		t.Errorf("Should have removed 4, but removed %d", value)
	}
	if ll.Size() != 3 {
		t.Errorf("Size should be 3, got %d", ll.Size())
	}

	// Test Clear.
	ll.Clear()
	if !ll.IsEmpty() {
		t.Error("List should be empty")
	}

	// Test RemoveAll.
	ll.AppendAll([]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10})
	if ll.Size() != 10 {
		t.Errorf("Size should be 10, got %d", ll.Size())
	}
	ll.RemoveAll(func(x int) bool {
		return x%2 != 0
	})
	if !reflect.DeepEqual(ll.ToArray(), []int{2, 4, 6, 8, 10}) {
		t.Error("List should only contain even numbers")
	}
	value, err = ll.Find(func(x int, _ int) bool {
		return x == 2
	})
	testError(err, t)
	if value != 2 {
		t.Errorf("2 should have been found in the list, got %d", value)
	}
}
