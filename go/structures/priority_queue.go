package structures

import "errors"

// PriorityQueueNode represents a node in the priority queue.
type PriorityQueueNode struct {
	value *Vertex
	next  *PriorityQueueNode
}

// PriorityQueue holds graph vertices and is meant to use with Dijkstra's algorithm.
type PriorityQueue struct {
	head *PriorityQueueNode
	size int
}

// Enqueue adds an element to the queue.
func (pq *PriorityQueue) Enqueue(value *Vertex) {
	node := &PriorityQueueNode{value: value}

	if pq.head == nil {
		pq.head = node
		pq.size++
		return
	}
	if pq.size == 1 {
		if predicate(value, pq.head.value) <= 0 {
			node.next = pq.head
			pq.head = node
		} else {
			pq.head.next = node
		}
		pq.size++
		return
	}
	if predicate(value, pq.head.value) <= 0 {
		node.next = pq.head
		pq.head = node
		pq.size++
		return
	}

	previousNode := pq.head
	currentNode := pq.head.next
	for currentNode != nil {
		if predicate(currentNode.value, value) <= 0 {
			break
		}
		previousNode = currentNode
		currentNode = currentNode.next
	}
	after := previousNode.next
	previousNode.next = node
	node.next = after
	pq.size++
}

// Dequeue removes and returns the front of the queue.
func (pq *PriorityQueue) Dequeue() (*Vertex, error) {
	if pq.head == nil {
		return nil, errors.New("Queue is empty")
	}
	value := pq.head.value
	pq.head = pq.head.next
	pq.size--
	return value, nil
}

// IsEmpty returns true if the queue is empty.
func (pq *PriorityQueue) IsEmpty() bool {
	return pq.size == 0
}

func predicate(a *Vertex, b *Vertex) int {
	if a.distance < b.distance {
		return 1
	}
	if a.distance == b.distance {
		return 0
	}
	return -1
}
