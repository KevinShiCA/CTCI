package structures

import (
	"errors"
	"strconv"
)

// BinarySearchTree is a binary tree that follows the property left < middle < right.
type BinarySearchTree struct {
	root *BinaryTreeNode
	size int
}

// Insert adds a new value to the tree.
func (t *BinarySearchTree) Insert(elem int) error {
	toInsert := BinaryTreeNode{value: elem}
	if t.root == nil {
		t.root = &toInsert
		t.size = 1
		return nil
	}

	currentNode := t.root
	for !isLeaf(currentNode) {
		if elem == currentNode.value {
			return errors.New("Value already exists: " + strconv.Itoa(elem))
		}
		if elem < currentNode.value {
			if currentNode.left == nil {
				break
			}
			currentNode = currentNode.left
		} else {
			if currentNode.right == nil {
				break
			}
			currentNode = currentNode.right
		}
	}
	if elem == currentNode.value {
		return errors.New("Value already exists: " + strconv.Itoa(elem))
	}
	toInsert.parent = currentNode
	if elem < currentNode.value {
		currentNode.left = &toInsert
	} else {
		currentNode.right = &toInsert
	}
	t.size++
	return nil
}

// InsertAll inserts all elements in a slice sequentially.
func (t *BinarySearchTree) InsertAll(elems []int) error {
	var e error
	for _, elem := range elems {
		err := t.Insert(elem)
		if err != nil {
			e = err
		}
	}
	return e
}

// Delete removes a node from the tree.
func (t *BinarySearchTree) Delete(elem int) error {
	currentNode := t.root
	for currentNode != nil && elem != currentNode.value {
		if elem < currentNode.value {
			currentNode = currentNode.left
		} else {
			currentNode = currentNode.right
		}
	}
	if currentNode == nil {
		return errors.New("Delete failed, value does not exist: " + strconv.Itoa(elem))
	}

	var rootReplacement *BinaryTreeNode // Used only if deleting the root.
	if isLeaf(currentNode) {
		if !isRoot(currentNode) {
			if getRelationship(currentNode.parent, currentNode) == LeftChild {
				currentNode.parent.left = nil
			} else {
				currentNode.parent.right = nil
			}
		}
	} else if numberOfChildren(currentNode) == 1 {
		// Replace with left or right child, whichever exists.
		var replacement *BinaryTreeNode
		if currentNode.left != nil {
			replacement = currentNode.left
		} else {
			replacement = currentNode.right
		}
		replacement.parent = currentNode.parent
		if isRoot(currentNode) {
			if currentNode.left != nil {
				rootReplacement = currentNode.left
			} else {
				rootReplacement = currentNode.right
			}
			rootReplacement.parent = nil
		} else if getRelationship(currentNode.parent, currentNode) == LeftChild {
			currentNode.parent.left = replacement
		} else {
			currentNode.parent.right = replacement
		}
	} else {
		// Element has two children.
		// Find the minimum in the right subtree, replace the node with it.
		minInRightSubtree := getMinInSubtree(currentNode.right)
		// The replacement node is either a leaf or has a right child.
		if getRelationship(minInRightSubtree.parent, minInRightSubtree) == LeftChild {
			minInRightSubtree.parent.left = minInRightSubtree.right
		} else {
			minInRightSubtree.parent.right = minInRightSubtree.right
		}

		minInRightSubtree.parent = currentNode.parent
		minInRightSubtree.left = currentNode.left
		minInRightSubtree.right = currentNode.right
		if minInRightSubtree.left != nil {
			minInRightSubtree.left.parent = minInRightSubtree
		}
		if minInRightSubtree.right != nil {
			minInRightSubtree.right.parent = minInRightSubtree
		}

		if isRoot(currentNode) {
			minInRightSubtree.parent = nil
			rootReplacement = minInRightSubtree
		} else if getRelationship(currentNode.parent, currentNode) == LeftChild {
			minInRightSubtree.parent.left = minInRightSubtree
		} else {
			minInRightSubtree.parent.right = minInRightSubtree
		}
	}
	if elem == t.root.value {
		t.root = rootReplacement
	}
	t.size--
	return nil
}

// Search returns true if the value exists in the tree.
func (t *BinarySearchTree) Search(elem int) bool {
	if t.root == nil {
		return false
	}
	return searchHelper(elem, t.root)
}

func searchHelper(elem int, node *BinaryTreeNode) bool {
	if node == nil {
		return false
	}
	if elem == node.value {
		return true
	}
	if elem < node.value {
		return searchHelper(elem, node.left)
	}
	return searchHelper(elem, node.right)
}

// Depth returns the depth of a given element, -1 if the element is not found.
func (t *BinarySearchTree) Depth(elem int) int {
	depth := 0
	currentNode := t.root
	for currentNode != nil {
		if elem == currentNode.value {
			return depth
		}
		if elem < currentNode.value {
			currentNode = currentNode.left
		} else {
			currentNode = currentNode.right
		}
		depth++
	}
	return -1
}

// Clear removes all nodes in the tree.
func (t *BinarySearchTree) Clear() {
	t.root = nil
	t.size = 0
}

// IsEmpty returns true if the tree contains no nodes.
func (t *BinarySearchTree) IsEmpty() bool {
	return t.size == 0
}

// Size returns the number of nodes in the tree.
func (t *BinarySearchTree) Size() int {
	return t.size
}

// InOrder returns the tree's in order traversal as a slice.
func (t *BinarySearchTree) InOrder() []int {
	temp := make([]int, 0)
	result := &temp
	inOrderHelper(t.root, &result)
	return *result
}

func inOrderHelper(node *BinaryTreeNode, result **[]int) {
	if node == nil {
		return
	}
	inOrderHelper(node.left, result)
	temp := append(**result, node.value)
	*result = &temp
	inOrderHelper(node.right, result)
}
