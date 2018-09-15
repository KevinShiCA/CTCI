package structures_test

import (
	"testing"

	"../structures"
)

func TestQueue(t *testing.T) {
	arrayQueue := &structures.ArrayQueue{}
	queueTests(arrayQueue, t)

	linkedQueue := &structures.LinkedQueue{}
	queueTests(linkedQueue, t)
}

func queueTests(queue structures.Queue, t *testing.T) {
	queue.Enqueue(3)
	front, err := queue.Peek()

	testError(err, t)
	if front != 3 {
		t.Errorf("Peek incorrect, expected 3, got %d", front)
		return
	}

	front, err = queue.Dequeue()

	testError(err, t)
	if front != 3 {
		t.Errorf("Dequeue incorrect, expected 3, got %d", front)
		return
	}
	_, err = queue.Dequeue()
	if err == nil {
		t.Errorf("Dequeue should throw an error, the queue is empty")
		return
	}
	if !queue.IsEmpty() {
		t.Error("Queue should be empty")
		return
	}

	queue.Enqueue(1)
	queue.Enqueue(2)
	queue.Enqueue(3)
	if queue.Size() != 3 {
		t.Error("Stack should contain 3 elements")
		return
	}

	front, _ = queue.Dequeue()
	if front != 1 {
		t.Errorf("Pop incorrect, expected 1, got %d", front)
		return
	}
	front, _ = queue.Dequeue()
	if front != 2 {
		t.Errorf("Pop incorrect, expected 2, got %d", front)
		return
	}

	queue.Clear()
	if !queue.IsEmpty() {
		t.Error("Stack should be empty")
		return
	}
}
