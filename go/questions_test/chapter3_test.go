package questions_test

import (
	"testing"

	"../questions"
	"../structures"
)

func TestChapter3(t *testing.T) {
	// 2.2 Min Stack
	stack := &questions.MinStack{LinkedStack: &structures.LinkedStack{}, Mins: &structures.LinkedStack{}}
	stack.Push(3)
	stack.Push(4)
	stack.Push(-1)
	testInt(stack.Min(), -1, t)
	stack.Push(5)
	stack.Push(-10)
	testInt(stack.Min(), -10, t)
	value, err := stack.Pop()
	testNoError(err, t)
	testInt(value, -10, t)
	testInt(stack.Min(), -1, t)
	value, err = stack.Pop()
	testNoError(err, t)
	testInt(value, 5, t)
}
