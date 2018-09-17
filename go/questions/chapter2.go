package questions

import (
	"errors"
	"math"
	"strconv"

	"../structures"
)

/** See chapter2.ts for problem descriptions. */

// DeleteDuplicatesBuffer removes duplicates from a linked list using a buffer.
// Time: O(n). Space: O(n).
func DeleteDuplicatesBuffer(head *structures.LinkedListNode) {
	visited := make(map[int]bool)
	var previous *structures.LinkedListNode
	currentNode := head
	for currentNode != nil {
		if visited[currentNode.Value] {
			previous.Next = currentNode.Next
		} else {
			visited[currentNode.Value] = true
			previous = currentNode
		}
		currentNode = currentNode.Next
	}
}

// DeleteDuplicatesNoBuffer removes duplicates from a linked list without a buffer.
// Time: O(n). Space: O(1).
func DeleteDuplicatesNoBuffer(head *structures.LinkedListNode) {
	currentNode := head
	for currentNode != nil {
		runner := currentNode
		for runner.Next != nil {
			if runner.Next.Value == currentNode.Value {
				runner.Next = runner.Next.Next
			} else {
				runner = runner.Next
			}
		}
		currentNode = currentNode.Next
	}
}

// NthToLastRecursive recursively finds the nth to last element of a linked list.
// Time: O(n). Space: O(n) heap space.
func NthToLastRecursive(head *structures.LinkedListNode, n int) (int, error) {
	tracer := 0
	return nthToLastRecursiveHelper(head, n, &tracer)
}

func nthToLastRecursiveHelper(node *structures.LinkedListNode, n int, tracer *int) (int, error) {
	if node == nil {
		return 0, errors.New("Cannot find nth to last element: " + strconv.Itoa(n))
	}
	nd, err := nthToLastRecursiveHelper(node.Next, n, tracer)
	*tracer++
	if *tracer == n {
		return node.Value, nil
	}
	return nd, err
}

// NthToLastIterative iteratively finds the nth to last element of a linked list.
// Time: O(n). Space: O(1).
func NthToLastIterative(head *structures.LinkedListNode, n int) (int, error) {
	currentNode := head
	scout := head
	for i := 0; i < n; i++ {
		if scout == nil {
			return 0, errors.New("Cannot find nth to last element: " + strconv.Itoa(n))
		}
		scout = scout.Next
	}
	for scout != nil {
		scout = scout.Next
		currentNode = currentNode.Next
	}
	return currentNode.Value, nil
}

// DeleteMiddleNode deletes a node in the middle of a linked list.
// Time: O(1). Space: O(1).
func DeleteMiddleNode(node *structures.LinkedListNode) error {
	if node == nil || node.Next == nil {
		return errors.New("Can only delete middle nodes")
	}
	next := node.Next
	node.Value = next.Value
	node.Next = next.Next
	return nil
}

// PartitionList partitions a linked list around a pivot x.
// Time: O(n). Space: O(n).
func PartitionList(head *structures.LinkedListNode, x int) *structures.LinkedListNode {
	var smallerHead, smallerTail,
		greaterHead, greaterTail,
		equalHead, equalTail *structures.LinkedListNode
	currentNode := head
	for currentNode != nil {
		if currentNode.Value == x {
			if equalHead == nil {
				equalHead = currentNode
				equalTail = currentNode
			} else {
				equalTail.Next = currentNode
				equalTail = currentNode
			}
		} else if currentNode.Value < x {
			if smallerHead == nil {
				smallerHead = currentNode
				smallerTail = currentNode
			} else {
				smallerTail.Next = currentNode
				smallerTail = currentNode
			}
		} else {
			if greaterHead == nil {
				greaterHead = currentNode
				greaterTail = currentNode
			} else {
				greaterTail.Next = currentNode
				greaterTail = currentNode
			}
		}
		currentNode = currentNode.Next
	}
	if smallerHead == nil {
		if equalHead == nil {
			return greaterHead
		}
		equalTail.Next = greaterHead
		return equalHead
	}
	if equalHead == nil {
		smallerTail.Next = greaterHead
		return smallerHead
	}
	smallerTail.Next = equalHead
	equalTail.Next = greaterHead
	return smallerHead
}

// SumListsReverse sums two numbers represented in reverse by linked lists.
// Time: O(n), where n is the length of the longer number. Space: O(n) heap space.
func SumListsReverse(head1 *structures.LinkedListNode, head2 *structures.LinkedListNode) *structures.LinkedListNode {
	return sumListsReverseHelper(head1, head2, 0)
}

func sumListsReverseHelper(node1 *structures.LinkedListNode, node2 *structures.LinkedListNode, carry int) *structures.LinkedListNode {
	if node1 == nil && node2 == nil && carry == 0 {
		return nil
	}
	value := carry
	if node1 != nil {
		value += node1.Value
	}
	if node2 != nil {
		value += node2.Value
	}
	result := &structures.LinkedListNode{Value: value % 10}
	if node1 != nil || node2 != nil {
		var next1, next2 *structures.LinkedListNode
		newCarry := 0
		if node1 != nil {
			next1 = node1.Next
		}
		if node2 != nil {
			next2 = node2.Next
		}
		if value >= 10 {
			newCarry = 1
		}
		temp := sumListsReverseHelper(next1, next2, newCarry)
		result.Next = temp
	}
	return result
}

// IsListPalindrome returns true if the linked list is a palindrome.
// Time: O(n). Space: O(n).
func IsListPalindrome(head *structures.LinkedListNode) bool {
	currentNode := head
	runner := head
	stack := &structures.LinkedStack{}
	for runner != nil && runner.Next != nil {
		stack.Push(currentNode.Value)
		currentNode = currentNode.Next
		runner = runner.Next.Next
	}
	if runner != nil {
		currentNode = currentNode.Next
	}
	for currentNode != nil {
		value, _ := stack.Pop()
		if value != currentNode.Value {
			return false
		}
		currentNode = currentNode.Next
	}
	return true
}

// ListIntersect returns the intersecting node of two linked lists of size M and N if it exists.
// Time: O(M + N). Space: O(1).
func ListIntersect(head1 *structures.LinkedListNode, head2 *structures.LinkedListNode) *structures.LinkedListNode {
	if head1 == nil || head2 == nil {
		return nil
	}
	type TailAndSize struct {
		tail *structures.LinkedListNode
		size int
	}
	getTailAndSize := func(node *structures.LinkedListNode) *TailAndSize {
		currentNode := node
		size := 0
		for currentNode.Next != nil {
			currentNode = currentNode.Next
			size++
		}
		return &TailAndSize{tail: currentNode, size: size + 1}
	}
	tailSize1 := getTailAndSize(head1)
	tailSize2 := getTailAndSize(head2)
	if tailSize1.tail != tailSize2.tail {
		return nil
	}
	var shorter, longer *structures.LinkedListNode
	if tailSize1.size < tailSize2.size {
		shorter = head1
		longer = head2
	} else {
		shorter = head2
		longer = head1
	}
	for i := 0; i < int(math.Abs(float64(tailSize1.size)-float64(tailSize2.size))); i++ {
		longer = longer.Next
	}
	for shorter != longer {
		shorter = shorter.Next
		longer = longer.Next
	}
	return shorter
}

// DetectLoop returns the start of a cycle in a linked list if it exists.
// Time: O(kn), where k is the size of the loop. Space: O(1).
func DetectLoop(head *structures.LinkedListNode) *structures.LinkedListNode {
	runner := head
	currentNode := head

	for runner != nil && runner.Next != nil {
		currentNode = currentNode.Next
		runner = runner.Next.Next
		if runner == currentNode {
			break
		}
	}

	if runner == nil || runner.Next == nil {
		return nil
	}

	currentNode = head
	for currentNode != runner {
		currentNode = currentNode.Next
		runner = runner.Next
	}
	return runner
}
