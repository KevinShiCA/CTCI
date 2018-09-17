package questions_test

import (
	"testing"

	"../questions"
	"../structures"
)

func TestChapter2(t *testing.T) {
	// 2.1 Remove Dups
	ll := &structures.LinkedList{}
	ll.AppendAll([]int{3, 4, 1, 2, 4, 1, 5, 6, 2, 1, 4, 3})
	questions.DeleteDuplicatesBuffer(ll.Head())
	testArray(ll.ToArray(), []int{3, 4, 1, 2, 5, 6}, t)

	ll.Clear()
	ll.AppendAll([]int{3, 4, 1, 2, 4, 1, 5, 6, 2, 1, 4, 3})
	questions.DeleteDuplicatesNoBuffer(ll.Head())
	testArray(ll.ToArray(), []int{3, 4, 1, 2, 5, 6}, t)

	ll.Clear()
	ll.AppendAll([]int{1, 2, 3, 4, 5})
	questions.DeleteDuplicatesBuffer(ll.Head())
	testArray(ll.ToArray(), []int{1, 2, 3, 4, 5}, t)

	ll.Clear()
	ll.AppendAll([]int{1, 2, 3, 4, 5})
	questions.DeleteDuplicatesNoBuffer(ll.Head())
	testArray(ll.ToArray(), []int{1, 2, 3, 4, 5}, t)

	// 2.2 Nth to Last
	ll.Clear()
	ll.AppendAll([]int{1, 2, 3, 4, 5, 6, 7, 8, 9})
	value, err := questions.NthToLastRecursive(ll.Head(), 3)
	testNoError(err, t)
	testInt(value, 7, t)
	value, err = questions.NthToLastIterative(ll.Head(), 3)
	testNoError(err, t)
	testInt(value, 7, t)

	ll.Clear()
	ll.Append(2)
	_, err = questions.NthToLastRecursive(ll.Head(), 2)
	testErrorExists(err, "List is too short, cannot get 2nd to last element", t)
	_, err = questions.NthToLastIterative(ll.Head(), 2)
	testErrorExists(err, "List is too short, cannot get 2nd to last element", t)

	// 2.3 Delete Middle Node
	a := &structures.LinkedListNode{Value: 1}
	b := &structures.LinkedListNode{Value: 2}
	c := &structures.LinkedListNode{Value: 3}
	b.Next = c
	a.Next = b
	questions.DeleteMiddleNode(b)
	testInt(a.Next.Value, 3, t)
	testErrorExists(questions.DeleteMiddleNode(c), "Can only delete middle nodes", t)

	// 2.4 Partition List
	ll.Clear()
	ll.AppendAll([]int{3, 4, 1, 6, 8, 2, 9, 5})

	llTemp := &structures.LinkedList{}
	llTemp.SetHead(questions.PartitionList(ll.Head(), 3))
	testArray(llTemp.ToArray(), []int{1, 2, 3, 4, 6, 8, 9, 5}, t)

	ll.Clear()
	ll.AppendAll([]int{10, 40, 50, 20, 30, 60})
	llTemp.SetHead(questions.PartitionList(ll.Head(), 25))
	testArray(llTemp.ToArray(), []int{10, 20, 40, 50, 30, 60}, t)

	ll.Clear()
	ll.AppendAll([]int{1, 1, 1, 2, 3, 1, 2})
	llTemp.SetHead(questions.PartitionList(ll.Head(), 1))
	testArray(llTemp.ToArray(), []int{1, 1, 1, 1, 2, 3, 2}, t)

	ll.Clear()
	ll.AppendAll([]int{1, 1, 1, 2, 3, 1, 2})
	llTemp.SetHead(questions.PartitionList(ll.Head(), 0))
	testArray(llTemp.ToArray(), []int{1, 1, 1, 2, 3, 1, 2}, t)

	ll.Clear()
	ll.AppendAll([]int{1, 1, 1, 2, 3, 1, 2})
	llTemp.SetHead(questions.PartitionList(ll.Head(), 4))
	testArray(llTemp.ToArray(), []int{1, 1, 1, 2, 3, 1, 2}, t)

	// 2.5 Sum Lists
	ll1 := &structures.LinkedList{}
	ll2 := &structures.LinkedList{}
	ll3 := &structures.LinkedList{}
	ll1.AppendAll([]int{7, 4, 2})
	ll2.AppendAll([]int{4, 9, 8})
	ll3.SetHead(questions.SumListsReverse(ll1.Head(), ll2.Head()))
	testArray(ll3.ToArray(), []int{1, 4, 1, 1}, t)

	ll1.Clear()
	ll2.Clear()
	ll1.AppendAll([]int{1, 2})
	ll2.AppendAll([]int{5, 6, 2, 4, 7})
	ll3.SetHead(questions.SumListsReverse(ll1.Head(), ll2.Head()))
	testArray(ll3.ToArray(), []int{6, 8, 2, 4, 7}, t)
	ll3.SetHead(questions.SumListsReverse(ll2.Head(), ll1.Head()))
	testArray(ll3.ToArray(), []int{6, 8, 2, 4, 7}, t)

	// 2.6 Palindrome List
	ll.Clear()
	ll.AppendAll([]int{1, 2, 3, 4, 3, 2, 1})
	testBoolean(questions.IsListPalindrome(ll.Head()), true, t)
	ll.Clear()
	ll.AppendAll([]int{1, 2, 3, 4, 4, 3, 2, 1})
	testBoolean(questions.IsListPalindrome(ll.Head()), true, t)
	ll.Clear()
	ll.AppendAll([]int{1, 2, 3, 4, 5, 3, 2, 1})
	testBoolean(questions.IsListPalindrome(ll.Head()), false, t)

	// 2.7 List Intersection
	intersection := &structures.LinkedListNode{Value: 3}
	n1 := &structures.LinkedListNode{Value: 2, Next: intersection}
	n2 := &structures.LinkedListNode{Value: 1,
		Next: &structures.LinkedListNode{Value: 5,
			Next: &structures.LinkedListNode{Value: 6, Next: intersection}}}
	testInt(questions.ListIntersect(n1, n2).Value, 3, t)

	n1 = &structures.LinkedListNode{Value: 1,
		Next: &structures.LinkedListNode{Value: 5,
			Next: &structures.LinkedListNode{Value: 6, Next: intersection}}}
	testInt(questions.ListIntersect(n1, n2).Value, 3, t)
	ll.Clear()
	ll.Append(2)
	testBoolean(questions.ListIntersect(ll.Head(), n1) == nil, true, t)
	n2 = nil
	testBoolean(questions.ListIntersect(n1, n2) == nil, true, t)

	// 2.8 Loop Detection
	loop := &structures.LinkedListNode{Value: 3}
	loop.Next = &structures.LinkedListNode{Value: 2,
		Next: &structures.LinkedListNode{Value: 8,
			Next: &structures.LinkedListNode{Value: 4, Next: loop}}}
	n1 = &structures.LinkedListNode{Value: 1, Next: loop}
	testInt(questions.DetectLoop(n1).Value, 3, t)
	ll.Clear()
	ll.AppendAll([]int{1, 2, 3, 4, 5})
	testBoolean(questions.DetectLoop(ll.Head()) == nil, true, t)
}
