package structures

import (
	"errors"
	"strconv"
)

const (
	// MinHeap type.
	MinHeap = iota
	// MaxHeap type.
	MaxHeap = iota
)

// BinaryHeap can represent either a max or a min heap.
type BinaryHeap struct {
	HeapType uint32
	root     *BinaryTreeNode
	size     int
}

// Insert adds a new element to the heap.
func (heap *BinaryHeap) Insert(elem int) error {
	toInsert := &BinaryTreeNode{value: elem}
	if heap.root == nil {
		heap.root = toInsert
		heap.size = 1
		return nil
	}
	if heap.size == 1 && heap.getPriority(heap.root, toInsert) == 0 {
		return errors.New("Value already exists in heap: " + strconv.Itoa(elem))
	}
	insertAtNode := heap.getInsertNode()

	toInsert.parent = insertAtNode
	if isLeaf(insertAtNode) {
		insertAtNode.left = toInsert
	} else {
		insertAtNode.right = toInsert
	}
	for toInsert.parent != nil && heap.getPriority(toInsert.parent, toInsert) > 0 {
		if heap.getPriority(toInsert.parent, toInsert) == 0 {
			return errors.New("Value already exists in heap: " + strconv.Itoa(elem))
		}
		heap.swap(toInsert.parent, toInsert)
	}
	heap.size++
	return nil
}

// InsertAll inserts all elements in a slice sequentially.
func (heap *BinaryHeap) InsertAll(elems []int) error {
	var e error
	for _, elem := range elems {
		err := heap.Insert(elem)
		if err != nil {
			e = err
		}
	}
	return e
}

// RemoveTop removes and returns the root of the heap.
// The only error that can be thrown at this point is empty heap.
func (heap *BinaryHeap) RemoveTop() (int, error) {
	if heap.root == nil {
		return 0, errors.New("Heap is empty")
	}
	newRoot := heap.getRemoveNode()
	value := heap.root.value
	if isRoot(newRoot) {
		heap.Clear()
		return value, nil
	}
	if getRelationship(newRoot.parent, newRoot) == LeftChild {
		newRoot.parent.left = nil
	} else {
		newRoot.parent.right = nil
	}
	newRoot.parent = nil
	newRoot.left = heap.root.left
	newRoot.right = heap.root.right

	currentNode := newRoot
	didSwap := false
	for !isLeaf(currentNode) {
		// Because of the insertion strategy,
		// it is impossible for the left child to not exist if currentNode is not a leaf.
		var leftPriority, rightPriority int
		leftPriority = heap.getPriority(currentNode.left, currentNode)
		if currentNode.right != nil {
			rightPriority = heap.getPriority(currentNode.right, currentNode)
		}
		// Check for empty variable using 0 is safe because it same values would be caught in Insert.
		if rightPriority == 0 { // There is only one child (left child).
			if leftPriority < 0 {
				heap.swap(currentNode, currentNode.left)
				didSwap = true
			} else {
				break
			}
		} else { // Both children exist.
			if heap.getPriority(currentNode, currentNode.left) < 0 && heap.getPriority(currentNode, currentNode.right) < 0 {
				// Node is in the correct position.
				break
			}
			// Otherwise, keep bubbling.
			leftRightPriority := heap.getPriority(currentNode.left, currentNode.right)
			if leftRightPriority < 0 { // Left is smaller, so bubble left.
				heap.swap(currentNode, currentNode.left)
			} else {
				heap.swap(currentNode, currentNode.right)
			}
			didSwap = true
		}
	}
	// New root was immediately placed in the right position, swap pointers manually.
	// This can only occur when deleting from a heap of size 3 (resulting in size 2).
	if !didSwap {
		heap.root = newRoot
		heap.root.parent = nil
		// No need to check the right child, since it cannot exist in a heap of size 2.
		if heap.root.left != nil {
			heap.root.left.parent = heap.root
		}
	}
	heap.size--
	return value, nil
}

// Top returns the value at the top of the heap.
func (heap *BinaryHeap) Top() (int, error) {
	if heap.root == nil {
		return 0, errors.New("Heap is empty")
	}
	return heap.root.value, nil
}

// Clear removes all elements in the heap.
func (heap *BinaryHeap) Clear() {
	heap.root = nil
	heap.size = 0
}

// Size returns the number of elements in the heap.
func (heap *BinaryHeap) Size() int {
	return heap.size
}

// IsEmpty returns true if the heap has no elements.
func (heap *BinaryHeap) IsEmpty() bool {
	return heap.size == 0
}

func (heap *BinaryHeap) getInsertNode() *BinaryTreeNode {
	return getInsertNodeHelper(heap.root)
}

func getInsertNodeHelper(node *BinaryTreeNode) *BinaryTreeNode {
	if node.left == nil || node.right == nil {
		return node
	}
	if subtreeSize(node.left) <= subtreeSize(node.right) {
		return getInsertNodeHelper(node.left)
	}
	return getInsertNodeHelper(node.right)
}

func (heap *BinaryHeap) getRemoveNode() *BinaryTreeNode {
	return getRemoveNodeHelper(heap.root)
}

func getRemoveNodeHelper(node *BinaryTreeNode) *BinaryTreeNode {
	if isLeaf(node) {
		return node
	}
	if subtreeSize(node.left) <= subtreeSize(node.right) {
		return getRemoveNodeHelper(node.right)
	}
	return getRemoveNodeHelper(node.left)
}

func (heap *BinaryHeap) swap(parent *BinaryTreeNode, child *BinaryTreeNode) {
	var top, bottomLeft, bottomRight, sibling *BinaryTreeNode
	top = parent.parent
	bottomLeft = child.left
	bottomRight = child.right
	if getRelationship(parent, child) == LeftChild {
		sibling = parent.right
	} else {
		sibling = parent.left
	}

	child.parent = top
	if getRelationship(parent, child) == LeftChild {
		child.left = parent
	} else {
		child.right = parent
	}
	if top != nil {
		if getRelationship(top, parent) == LeftChild {
			top.left = child
		} else {
			top.right = child
		}
	}
	if sibling == nil {
		// If the sibling doesn't exist, then the child must be a left child.
		child.right = nil
	} else {
		if getRelationship(parent, sibling) == LeftChild {
			child.left = sibling
		} else {
			child.right = sibling
		}
		sibling.parent = child
	}
	parent.left = bottomLeft
	if bottomLeft != nil {
		bottomLeft.parent = parent
	}
	parent.right = bottomRight
	if bottomRight != nil {
		bottomRight.parent = parent
	}

	parent.parent = child
	if isRoot(child) {
		heap.root = child
	}
}

// Lowest priority goes to the top of the heap.
func (heap *BinaryHeap) getPriority(a *BinaryTreeNode, b *BinaryTreeNode) int {
	if heap.HeapType == MinHeap {
		return a.value - b.value
	}
	return b.value - a.value
}
