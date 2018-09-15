package structures

import "errors"

// Stack of ints.
type Stack interface {
	Peek() (int, error)
	Push(elem int)
	Pop() (int, error)
	Size() int
	Clear()
	IsEmpty() bool
}

// StackNode represents a node in the linked stack.
type StackNode struct {
	value int
	next  *StackNode
}

// LinkedStack implements Stack using a linked list.
type LinkedStack struct {
	top  *StackNode
	size int
}

// Peek returns the top the element of the stack.
func (s *LinkedStack) Peek() (int, error) {
	if s.IsEmpty() {
		return 0, errors.New("Stack is empty")
	}
	return s.top.value, nil
}

// Push adds an element onto the stack.
func (s *LinkedStack) Push(elem int) {
	s.top = &StackNode{value: elem, next: s.top}
	s.size++
}

// Pop removes and returns the top element of the stack.
func (s *LinkedStack) Pop() (int, error) {
	value, err := s.Peek()
	if err != nil {
		return 0, err
	}
	s.top = s.top.next
	s.size--
	return value, nil
}

// Size returns the number of elements in the stack.
func (s *LinkedStack) Size() int {
	return s.size
}

// Clear removes all elements in the stack.
func (s *LinkedStack) Clear() {
	s.top = nil
	s.size = 0
}

// IsEmpty returns true when the stack is empty.
func (s *LinkedStack) IsEmpty() bool {
	return s.Size() == 0
}

// ArrayStack implements Stack using an array.
type ArrayStack struct {
	elems []int
}

// Peek returns the top the element of the stack.
func (s *ArrayStack) Peek() (int, error) {
	if s.IsEmpty() {
		return 0, errors.New("Stack is empty")
	}
	return s.elems[len(s.elems)-1], nil
}

// Push adds an element onto the stack. The end of the slice represents the top.
func (s *ArrayStack) Push(elem int) {
	s.elems = append(s.elems, elem)
}

// Pop removes and returns the top element of the stack.
func (s *ArrayStack) Pop() (int, error) {
	value, err := s.Peek()
	if err != nil {
		return 0, err
	}
	s.elems = s.elems[:len(s.elems)-1]
	return value, nil
}

// Size returns the number of elements in the stack.
func (s *ArrayStack) Size() int {
	return len(s.elems)
}

// Clear removes all elements in the stack.
func (s *ArrayStack) Clear() {
	s.elems = nil
}

// IsEmpty returns true when the stack is empty.
func (s *ArrayStack) IsEmpty() bool {
	return s.Size() == 0
}
