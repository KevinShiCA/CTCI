package structures_test

import (
	"fmt"
	"reflect"
	"strings"
	"testing"

	"../structures"
)

/**
 *     50
 *   /    \
 * 25     80
 *  \    /  \
 *  30  60  90
 *          /
 *         85
 */
var BinarySearchTreeA = []int{50, 25, 30, 80, 60, 90, 85}

/**
 *        50
 *      /    \
 *    -1     100
 *   /  \       \
 * -30  20      300
 *     /  \     /  \
 *    10  30  200  400
 */
var BinarySearchTreeB = []int{50, -1, 100, -30, 20, 300, 10, 30, 200, 400}

func TestBinarySearchTree(t *testing.T) {
	bst := &structures.BinarySearchTree{}

	// Test Insert.
	err := bst.InsertAll([]int{4, -2, 10, 1000, 3})
	testError(err, t)
	testBSTSize(bst, 5, t)
	testInOrder(bst, []int{-2, 3, 4, 10, 1000}, t)

	bst.Clear()
	if !bst.IsEmpty() {
		t.Error("Tree should be empty after clear")
	}

	bst.Insert(4)
	err = bst.Insert(4)
	if err == nil {
		t.Error("Insert should throw error, 4 already exists")
	}
	testBSTSize(bst, 1, t)

	bst.Clear()
	err = bst.InsertAll([]int{1, 2, 3, 4, 5})
	testError(err, t)
	err = bst.InsertAll([]int{4, 5, -1, -2, -3})
	if err == nil {
		t.Error("InsertAll should throw error, 4 and 5 already exist")
	}
	testBSTSize(bst, 8, t)

	// Test Delete.
	// Delete leaves only.
	resetToTreeA(bst, t)
	bst.Delete(60)
	testInOrder(bst, []int{25, 30, 50, 80, 85, 90}, t)
	bst.Delete(85)
	testInOrder(bst, []int{25, 30, 50, 80, 90}, t)
	bst.Delete(90)
	testInOrder(bst, []int{25, 30, 50, 80}, t)
	bst.Delete(80)
	testInOrder(bst, []int{25, 30, 50}, t)
	bst.Delete(30)
	testInOrder(bst, []int{25, 50}, t)
	bst.Delete(25)
	testInOrder(bst, []int{50}, t)

	// Delete nodes with one child.
	resetToTreeA(bst, t)
	bst.Delete(90)
	testInOrder(bst, []int{25, 30, 50, 60, 80, 85}, t)
	bst.Delete(25)
	testInOrder(bst, []int{30, 50, 60, 80, 85}, t)

	// Delete non-existant nodes.
	err = bst.Delete(90)
	if err == nil {
		t.Error("Delete should throw error, 90 does not exist")
	}
	err = bst.Delete(123)
	if err == nil {
		t.Error("Delete should throw error, 90 does not exist")
	}

	// Delete nodes with two children.
	resetToTreeB(bst, t)
	bst.Delete(-1)
	testInOrder(bst, []int{-30, 10, 20, 30, 50, 100, 200, 300, 400}, t)
	bst.Delete(10)
	testInOrder(bst, []int{-30, 20, 30, 50, 100, 200, 300, 400}, t)
	bst.Delete(20)
	testInOrder(bst, []int{-30, 30, 50, 100, 200, 300, 400}, t)
	bst.Delete(30)
	testInOrder(bst, []int{-30, 50, 100, 200, 300, 400}, t)
	bst.Delete(300)
	testInOrder(bst, []int{-30, 50, 100, 200, 400}, t)
	bst.Delete(400)
	testInOrder(bst, []int{-30, 50, 100, 200}, t)
	bst.Delete(100)
	testInOrder(bst, []int{-30, 50, 200}, t)
	bst.Delete(50)
	testInOrder(bst, []int{-30, 200}, t)

	// Delete the root only.
	resetToTreeA(bst, t)
	bst.Delete(50)
	testInOrder(bst, []int{25, 30, 60, 80, 85, 90}, t)
	bst.Delete(60)
	testInOrder(bst, []int{25, 30, 80, 85, 90}, t)
	bst.Delete(80)
	testInOrder(bst, []int{25, 30, 85, 90}, t)
	bst.Delete(85)
	testInOrder(bst, []int{25, 30, 90}, t)
	bst.Delete(90)
	testInOrder(bst, []int{25, 30}, t)
	bst.Delete(25)
	testInOrder(bst, []int{30}, t)
	bst.Delete(30)
	if !bst.IsEmpty() {
		t.Error("Tree should be empty after deleting all nodes")
	}
	err = bst.Delete(0)
	if err == nil {
		t.Error("Delete should fail, the tree is empty")
	}

	// Test Search.
	bst.Clear()
	if bst.Search(123) {
		t.Error("Search should fail, the tree is empty")
	}

	resetToTreeA(bst, t)
	if !bst.Search(50) || !bst.Search(85) || !bst.Search(25) {
		t.Error("Search failed, 50, 85, 25 are in the tree")
	}
	if bst.Search(123) {
		t.Error("Search should fail, 123 is not in the tree")
	}

	err = bst.Delete(50)
	testError(err, t)
	if bst.Search(50) {
		t.Error("Search should fail, 50 was deleted")
	}

	// Test Depth.
	resetToTreeB(bst, t)
	if bst.Depth(50) != 0 {
		t.Errorf("Depth incorrect, expected 0, got %d", bst.Depth(50))
	}
	if bst.Depth(100) != 1 {
		t.Errorf("Depth incorrect, expected 1, got %d", bst.Depth(100))
	}
	if bst.Depth(20) != 2 {
		t.Errorf("Depth incorrect, expected 2, got %d", bst.Depth(20))
	}
	if bst.Depth(200) != 3 {
		t.Errorf("Depth incorrect, expected 3, got %d", bst.Depth(200))
	}
	if bst.Depth(10) != 3 {
		t.Errorf("Depth incorrect, expected 3, got %d", bst.Depth(10))
	}
	if bst.Depth(123) != -1 {
		t.Errorf("Depth incorrect, 123 is not in the tree so the depth should be -1, got %d", bst.Depth(123))
	}
}

func resetToTreeA(bst *structures.BinarySearchTree, t *testing.T) {
	bst.Clear()
	bst.InsertAll(BinarySearchTreeA)
	testInOrder(bst, []int{25, 30, 50, 60, 80, 85, 90}, t)
}

func resetToTreeB(bst *structures.BinarySearchTree, t *testing.T) {
	bst.Clear()
	bst.InsertAll(BinarySearchTreeB)
	testInOrder(bst, []int{-30, -1, 10, 20, 30, 50, 100, 200, 300, 400}, t)
}

func testInOrder(bst *structures.BinarySearchTree, expected []int, t *testing.T) {
	traversal := bst.InOrder()
	if !reflect.DeepEqual(bst.InOrder(), expected) {
		actual := intSliceToString(traversal)
		t.Errorf("In order check failed. Expected {%s} got {%s}", intSliceToString(expected), actual)
	}
}

func testBSTSize(bst *structures.BinarySearchTree, expected int, t *testing.T) {
	if bst.Size() != expected {
		t.Errorf("Tree size should be %d, got %d", expected, bst.Size())
	}
}

func intSliceToString(slice []int) string {
	return strings.Trim(strings.Replace(fmt.Sprint(slice), " ", ",", -1), "[]")
}
