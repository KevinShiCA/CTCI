package structures_test

import (
	"reflect"
	"testing"

	"../structures"
)

func TestBinaryMinHeap(t *testing.T) {
	heap := &structures.BinaryHeap{HeapType: structures.MinHeap}

	// Basic Insert, no bubbling.
	heap.InsertAll([]int{3, 5, 6, 7, 8})
	testTop(heap, 3, t)
	testRemoveTop(heap, 3, t)
	testHeapSize(heap, 4, t)
	testTop(heap, 5, t)
	testRemoveTop(heap, 5, t)
	testHeapSize(heap, 3, t)
	heap.Clear()
	if !heap.IsEmpty() {
		t.Error("Heap should be empty after clearing")
	}

	// Complex Insert, lots of bubbling.
	heap.InsertAll([]int{5, 2, 9, -1, -2, 10, -10, 30, 3})
	testRemoveTop(heap, -10, t)
	testRemoveTop(heap, -2, t)
	testRemoveTop(heap, -1, t)
	testRemoveTop(heap, 2, t)
	testRemoveTop(heap, 3, t)
	testRemoveTop(heap, 5, t)
	testRemoveTop(heap, 9, t)
	testRemoveTop(heap, 10, t)
	testRemoveTop(heap, 30, t)
	if !heap.IsEmpty() {
		t.Error("Heap should be empty after removing all elements")
	}
	_, err := heap.Top()
	if err == nil {
		t.Error("Top should throw error, the heap is empty")
	}
	_, err = heap.RemoveTop()
	if err == nil {
		t.Error("RemoveTop should throw error, the heap is empty")
	}

	// Edge case where one subtree is extremely clustered in value compared to the other.
	heap.InsertAll([]int{500, 1000, 1100, 2000, 1200, 3000, 1300, 4000, 1500})
	testRemoveTop(heap, 500, t)
	testRemoveTop(heap, 1000, t)
	testRemoveTop(heap, 1100, t)
	testRemoveTop(heap, 1200, t)
	testRemoveTop(heap, 1300, t)
	testRemoveTop(heap, 1500, t)
	testRemoveTop(heap, 2000, t)
	testRemoveTop(heap, 3000, t)
	testRemoveTop(heap, 4000, t)
	if !heap.IsEmpty() {
		t.Error("Heap should be empty after removing all elements")
	}
	_, err = heap.Top()
	if err == nil {
		t.Error("Top should throw error, the heap is empty")
	}
	_, err = heap.RemoveTop()
	if err == nil {
		t.Error("RemoveTop should throw error, the heap is empty")
	}
}

func TestBinaryMaxHeap(t *testing.T) {
	heap := &structures.BinaryHeap{HeapType: structures.MaxHeap}

	// Basic Insert, no bubbling.
	heap.InsertAll([]int{8, 7, 5, 2, -1})
	testTop(heap, 8, t)
	testRemoveTop(heap, 8, t)
	testHeapSize(heap, 4, t)
	testTop(heap, 7, t)
	testRemoveTop(heap, 7, t)
	testHeapSize(heap, 3, t)
	heap.Clear()
	if !heap.IsEmpty() {
		t.Error("Heap should be empty after clearing")
	}

	// Complex Insert, lots of bubbling.
	heap.InsertAll([]int{5, 2, 9, -1, -2, 10, -10, 30, 3})
	testRemoveTop(heap, 30, t)
	testRemoveTop(heap, 10, t)
	testRemoveTop(heap, 9, t)
	testRemoveTop(heap, 5, t)
	testRemoveTop(heap, 3, t)
	testRemoveTop(heap, 2, t)
	testRemoveTop(heap, -1, t)
	testRemoveTop(heap, -2, t)
	testRemoveTop(heap, -10, t)
	if !heap.IsEmpty() {
		t.Error("Heap should be empty after removing all elements")
	}
	_, err := heap.Top()
	if err == nil {
		t.Error("Top should throw error, the heap is empty")
	}
	_, err = heap.RemoveTop()
	if err == nil {
		t.Error("RemoveTop should throw error, the heap is empty")
	}

	// Test duplicate insertion.
	err = heap.Insert(3)
	testError(err, t)
	err = heap.Insert(3)
	if err == nil {
		t.Error("Heap should an error, it already contains 3")
	}
	testHeapSize(heap, 1, t)

	// Test heapsort.
	heap.Clear()
	heap.InsertAll([]int{3, -1, 2000, 40, -123, 401, -9, 1005})
	result := make([]int, 0)
	for !heap.IsEmpty() {
		value, err := heap.RemoveTop()
		testError(err, t)
		result = append([]int{value}, result...)
	}
	if !reflect.DeepEqual(result, []int{-123, -9, -1, 3, 40, 401, 1005, 2000}) {
		t.Error("Heapsort failed")
	}
}

func testTop(heap *structures.BinaryHeap, expected int, t *testing.T) {
	value, err := heap.Top()
	testError(err, t)
	if value != expected {
		t.Errorf("Top incorrect, expected %d, got %d", expected, value)
	}
}

func testRemoveTop(heap *structures.BinaryHeap, expected int, t *testing.T) {
	value, err := heap.RemoveTop()
	testError(err, t)
	if value != expected {
		t.Errorf("RemoveTop incorrect, expected %d, got %d", expected, value)
	}
}

func testHeapSize(heap *structures.BinaryHeap, expected int, t *testing.T) {
	if heap.Size() != expected {
		t.Errorf("Heap size should be %d, got %d", expected, heap.Size())
	}
}
