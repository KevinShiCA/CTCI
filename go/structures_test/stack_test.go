package structures_test

import (
	"testing"

	"../structures"
)

func TestStack(t *testing.T) {
	arrayStack := &structures.ArrayStack{}
	stackTests(arrayStack, t)

	linkedStack := &structures.LinkedStack{}
	stackTests(linkedStack, t)
}

func stackTests(stack structures.Stack, t *testing.T) {
	stack.Push(3)
	top, err := stack.Peek()
	testError(err, t)
	if top != 3 {
		t.Errorf("Peek incorrect, expected 3, got %d", top)
		return
	}

	top, err = stack.Pop()
	testError(err, t)
	if top != 3 {
		t.Errorf("Pop incorrect, expected 3, got %d", top)
		return
	}
	top, err = stack.Pop()
	if err == nil {
		t.Errorf("Pop should throw an error, the stack is empty")
		return
	}
	if !stack.IsEmpty() {
		t.Error("Stack should be empty")
		return
	}

	stack.Push(1)
	stack.Push(2)
	stack.Push(3)
	if stack.Size() != 3 {
		t.Error("Stack should contain 3 elements")
		return
	}

	top, err = stack.Pop()
	testError(err, t)
	if top != 3 {
		t.Errorf("Pop incorrect, expected 3, got %d", top)
		return
	}
	top, err = stack.Pop()
	testError(err, t)
	if top != 2 {
		t.Errorf("Pop incorrect, expected 2, got %d", top)
		return
	}

	stack.Clear()
	if !stack.IsEmpty() {
		t.Error("Stack should be empty")
		return
	}
}
