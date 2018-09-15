package structures

import "errors"

// Queue of ints.
type Queue interface {
	Peek() (int, error)
	Enqueue(elem int)
	Dequeue() (int, error)
	Size() int
	Clear()
	IsEmpty() bool
}

// QueueNode represents a node in the linked queue.
type QueueNode struct {
	value int
	next  *QueueNode
}

// LinkedQueue implements Queue using a linked list.
type LinkedQueue struct {
	head *QueueNode
	size int
}

// Peek returns the element at the front of the queue.
func (q *LinkedQueue) Peek() (int, error) {
	if q.IsEmpty() {
		return 0, errors.New("Queue is empty")
	}
	return q.head.value, nil
}

// Enqueue adds a new element to the back of the queue.
func (q *LinkedQueue) Enqueue(elem int) {
	newNode := QueueNode{value: elem}
	if q.IsEmpty() {
		q.head = &newNode
	} else {
		currentNode := q.head
		for currentNode.next != nil {
			currentNode = currentNode.next
		}
		currentNode.next = &newNode
	}
	q.size++
}

// Dequeue removes and returns the element at the front of the queue.
func (q *LinkedQueue) Dequeue() (int, error) {
	value, err := q.Peek()
	if err != nil {
		return 0, err
	}
	q.head = q.head.next
	q.size--
	return value, nil
}

// Size returns the number of elements in the queue.
func (q *LinkedQueue) Size() int {
	return q.size
}

// Clear removes all elements in the queue.
func (q *LinkedQueue) Clear() {
	q.head = nil
	q.size = 0
}

// IsEmpty returns true when the queue is empty.
func (q *LinkedQueue) IsEmpty() bool {
	return q.size == 0
}

// ArrayQueue implements Queue using an array.
type ArrayQueue struct {
	elems []int
}

// Peek returns the element at the front of the queue.
func (q *ArrayQueue) Peek() (int, error) {
	if q.IsEmpty() {
		return 0, errors.New("Queue is empty")
	}
	return q.elems[0], nil
}

// Enqueue adds a new element to the back of the queue. The front of the slice represents the front of the queue.
func (q *ArrayQueue) Enqueue(elem int) {
	q.elems = append(q.elems, elem)
}

// Dequeue removes and returns the element at the front of the queue.
func (q *ArrayQueue) Dequeue() (int, error) {
	value, err := q.Peek()
	if err != nil {
		return 0, err
	}
	q.elems = q.elems[1:]
	return value, nil
}

// Clear removes all elements in the queue.
func (q *ArrayQueue) Clear() {
	q.elems = nil
}

// Size returns the number of elements in the queue.
func (q *ArrayQueue) Size() int {
	return len(q.elems)
}

// IsEmpty returns true when the queue is empty.
func (q *ArrayQueue) IsEmpty() bool {
	return q.Size() == 0
}
