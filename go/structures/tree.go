package structures

const (
	// LeftChild binary node relationship.
	LeftChild = iota
	// RightChild binary node relationship.
	RightChild = iota
	// Parent binary node relationship.
	Parent = iota
	// None relationship.
	None = iota
)

// BinaryTreeNode represents a node in a binary tree.
type BinaryTreeNode struct {
	value  int
	parent *BinaryTreeNode
	left   *BinaryTreeNode
	right  *BinaryTreeNode
}

// NaryTreeNode represents a node in a generic tree.
type NaryTreeNode struct {
	value    int
	parent   *BinaryTreeNode
	children []*BinaryTreeNode
}

func numberOfChildren(node *BinaryTreeNode) int {
	result := 0
	if node.left != nil {
		result++
	}
	if node.right != nil {
		result++
	}
	return result
}

func subtreeSize(node *BinaryTreeNode) int {
	if node == nil {
		return 0
	}
	return 1 + subtreeSize(node.left) + subtreeSize(node.right)
}

func isRoot(node *BinaryTreeNode) bool {
	return node.parent == nil
}

func isLeaf(node *BinaryTreeNode) bool {
	return numberOfChildren(node) == 0
}

// Completes the sentence: b is a's _______.
func getRelationship(a *BinaryTreeNode, b *BinaryTreeNode) int {
	if a.left != nil && a.left.value == b.value {
		return LeftChild
	}
	if a.right != nil && a.right.value == b.value {
		return RightChild
	}
	if a.parent != nil && a.parent.value == b.value {
		return Parent
	}
	return None
}

// Finds the minimum value in a subtree at a given root.
func getMinInSubtree(node *BinaryTreeNode) *BinaryTreeNode {
	currentNode := node
	for currentNode.left != nil {
		currentNode = currentNode.left
	}
	return currentNode
}
