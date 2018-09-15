package structures

import (
	"errors"
	"hash/fnv"
)

// MapNode represents a node stored in the map.
// The key represents the unhashed key.
type MapNode struct {
	key   string
	value int
}

// Hashmap maps strings to ints.
type Hashmap struct {
	items map[uint32][]*MapNode
	size  int
}

func hash(str string) uint32 {
	h := fnv.New32a()
	h.Write([]byte(str))
	return h.Sum32()
}

func find(arr []*MapNode, key string) (*MapNode, error) {
	for _, elem := range arr {
		if elem.key == key {
			return elem, nil
		}
	}
	return nil, errors.New("Key not found: " + key)
}

func remove(arr []*MapNode, key string) ([]*MapNode, error) {
	for index, elem := range arr {
		if elem.key == key {
			return append(arr[:index], arr[index+1:]...), nil
		}
	}
	return nil, errors.New("Key does not exist in array: " + key)
}

// Put adds a new entry to the map.
func (m *Hashmap) Put(key string, value int) {
	if m.items == nil {
		m.items = make(map[uint32][]*MapNode)
	}
	hashCode := hash(key)
	arr, exists := m.items[hashCode]
	if !exists {
		m.items[hashCode] = make([]*MapNode, 0)
	}
	item, err := find(arr, key)
	// Value already exists in map, so override it.
	if err == nil {
		item.value = value
	} else {
		m.items[hashCode] = append(m.items[hashCode], &MapNode{key: key, value: value})
	}
	m.size++
}

// Get finds a value in the map by key.
func (m *Hashmap) Get(key string) (int, error) {
	hashCode := hash(key)
	arr, exists := m.items[hashCode]
	if !exists {
		return 0, errors.New("Key does not exist: " + key)
	}
	item, err := find(arr, key)
	if err != nil {
		return 0, errors.New("Key does not exist: " + key)
	}
	return item.value, nil
}

// Remove deletes and returns the value mapped to key.
func (m *Hashmap) Remove(key string) (int, error) {
	hashCode := hash(key)
	value, err := m.Get(key)
	if err != nil {
		return 0, err
	}
	newArr, err := remove(m.items[hashCode], key)
	if err != nil {
		return 0, err
	}
	m.items[hashCode] = newArr
	m.size--
	return value, nil
}

// ContainsKey returns true if the key has an entry in the map.
func (m *Hashmap) ContainsKey(key string) bool {
	_, err := m.Get(key)
	return err == nil
}

// ContainsValue returns true if the value is present in the map.
func (m *Hashmap) ContainsValue(value int) bool {
	values := m.Values()
	for _, elem := range values {
		if elem == value {
			return true
		}
	}
	return false
}

// Values returns the set of all values in the map as a slice.
func (m *Hashmap) Values() []int {
	result := make([]int, 0)
	for _, arr := range m.items {
		for _, node := range arr {
			result = append(result, node.value)
		}
	}
	return result
}

// Clear removes all entries in the map.
func (m *Hashmap) Clear() {
	m.items = nil
	m.size = 0
}

// IsEmpty returns true if the map has no entries.
func (m *Hashmap) IsEmpty() bool {
	return len(m.items) == 0
}

// Size returns the number of entries in the map.
func (m *Hashmap) Size() int {
	return m.size
}
