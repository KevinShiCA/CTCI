package questions

import (
	"math"

	"../structures"
)

// --------------------------------------------------------------------------

// MinStack is a stack that can find the min element in O(1) time.
type MinStack struct {
	*structures.LinkedStack
	Mins *structures.LinkedStack
}

// Push adds a new element onto the min stack.
func (ms *MinStack) Push(value int) {
	if value < ms.Min() {
		ms.Mins.Push(value)
	}
	ms.LinkedStack.Push(value)
}

// Pop removes and returns the top of the min stack.
func (ms *MinStack) Pop() (int, error) {
	value, err := ms.LinkedStack.Pop()
	if err != nil {
		return 0, err
	}
	if value == ms.Min() {
		ms.Mins.Pop()
	}
	return value, nil
}

// Min returns the min element of the stack.
func (ms *MinStack) Min() int {
	if ms.Mins.IsEmpty() {
		return math.MaxUint32
	}
	value, _ := ms.Mins.Peek()
	return value
}

// --------------------------------------------------------------------------
