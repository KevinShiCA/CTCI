package structures

import "errors"
import "strconv"

// LinkedListNode represents a node in the linked list.
type LinkedListNode struct {
	value int
	prev  *LinkedListNode
	next  *LinkedListNode
}

// LinkedList is doubly linked and holds ints.
type LinkedList struct {
	head *LinkedListNode
	tail *LinkedListNode
	size int
}

// Append adds an element to the end.
func (l *LinkedList) Append(elem int) {
	newNode := LinkedListNode{value: elem, prev: l.tail}
	if l.size == 0 {
		l.head = &newNode
		l.tail = &newNode
		l.size = 1
		return
	}

	l.tail.next = &newNode
	l.tail = &newNode
	l.size++
}

// AppendAll adds all elements in a given slice to the end.
func (l *LinkedList) AppendAll(elems []int) {
	for _, elem := range elems {
		l.Append(elem)
	}
}

// Add inserts an element into a given position.
func (l *LinkedList) Add(elem int, index int) error {
	if index > l.size || index < 0 {
		return errors.New("Index out of bounds: " + strconv.Itoa(index))
	}
	if l.size == 0 {
		l.Append(elem)
		return nil
	}
	newNode := LinkedListNode{value: elem}
	if index == 0 {
		newNode.next = l.head
		l.head = &newNode
		l.size++
		return nil
	}
	if index == l.size {
		newNode.prev = l.tail
		l.tail.next = &newNode
		l.tail = &newNode
		l.size++
		return nil
	}

	position := 0
	currentNode := l.head
	for position < index-1 {
		currentNode = currentNode.next
		position++
	}
	newNode.next = currentNode.next
	currentNode.next = &newNode
	newNode.prev = currentNode
	l.size++
	return nil
}

// Get returns the element at a given index.
func (l *LinkedList) Get(index int) (int, error) {
	if index >= l.size || index < 0 {
		return 0, errors.New("Index out of bounds: " + strconv.Itoa(index))
	}
	position := 0
	currentNode := l.head
	for position < index {
		currentNode = currentNode.next
		position++
	}
	return currentNode.value, nil
}

// Remove deletes the first occurenct of an element by value.
func (l *LinkedList) Remove(value int) error {
	currentNode := l.head
	for currentNode != nil && currentNode.value != value {
		currentNode = currentNode.next
	}
	if currentNode != nil {
		if currentNode == l.head {
			l.head = l.head.next
			if l.head != nil {
				l.head.prev = nil
			}
		} else if currentNode == l.tail {
			l.tail = l.tail.prev
			if l.tail != nil {
				l.tail.next = nil
			}
		} else {
			currentNode.prev.next = currentNode.next
			currentNode.next.prev = currentNode.prev
		}
		l.size--
		return nil
	}
	return errors.New("Value not found: " + strconv.Itoa(value))
}

// RemoveAt deletes and returns an element by index.
func (l *LinkedList) RemoveAt(index int) (int, error) {
	if index >= l.size || index < 0 {
		return 0, errors.New("Index out of bounds: " + strconv.Itoa(index))
	}
	if l.size == 1 {
		value := l.head.value
		l.Clear()
		return value, nil
	}
	if index == 0 {
		value := l.head.value
		l.head = l.head.next
		l.head.prev = nil
		l.size--
		return value, nil
	}
	if index == l.size-1 {
		value := l.tail.value
		l.tail = l.tail.prev
		l.tail.next = nil
		l.size--
		return value, nil
	}

	currentNode := l.head
	position := 0
	for position < index {
		currentNode = currentNode.next
		position++
	}
	value := currentNode.value
	currentNode.prev.next = currentNode.next
	currentNode.next.prev = currentNode.prev
	l.size--
	return value, nil
}

// RemoveAll deletes all elements that satisfy a given predicate.
func (l *LinkedList) RemoveAll(predicate func(int) bool) {
	l.ForEach(func(item int, _ int) {
		if predicate(item) {
			l.Remove(item)
		}
	})
}

// ForEach applies a function to each element in the list.
func (l *LinkedList) ForEach(fn func(int, int)) {
	currentNode := l.head
	index := 0
	for currentNode != nil {
		fn(currentNode.value, index)
		currentNode = currentNode.next
		index++
	}
}

// Find returns the first element to satisfy the predicate.
func (l *LinkedList) Find(predicate func(int, int) bool) (int, error) {
	currentNode := l.head
	index := 0
	for currentNode != nil {
		if predicate(currentNode.value, index) {
			return currentNode.value, nil
		}
		currentNode = currentNode.next
	}
	return 0, errors.New("No elements found")
}

// IndexOf returns the index of an element, -1 if not found.
func (l *LinkedList) IndexOf(elem int) int {
	currentNode := l.head
	index := 0
	for currentNode != nil {
		if currentNode.value == elem {
			return index
		}
		currentNode = currentNode.next
		index++
	}
	return -1
}

// Contains returns true if the element is present in the list.
func (l *LinkedList) Contains(elem int) bool {
	return l.IndexOf(elem) > -1
}

// ToArray returns a slice with the contents of the list.
func (l *LinkedList) ToArray() []int {
	result := make([]int, 0)
	currentNode := l.head
	for currentNode != nil {
		result = append(result, currentNode.value)
		currentNode = currentNode.next
	}
	return result
}

// Size returns the number of elements.
func (l *LinkedList) Size() int {
	return l.size
}

// IsEmpty returns true if the list is empty.
func (l *LinkedList) IsEmpty() bool {
	return l.size == 0
}

// Clear removes all elements.
func (l *LinkedList) Clear() {
	l.head = nil
	l.tail = nil
	l.size = 0
}
