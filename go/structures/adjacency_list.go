package structures

import (
	"errors"
	"math"
)

// AdjacencyList represents a directed weighted graph implemented using an adjacency list.
type AdjacencyList struct {
	list     map[string][]*Edge
	vertices []*Vertex
	edges    []*Edge
}

// AddVertex adds a new vertex to the graph.
func (g *AdjacencyList) AddVertex(value string) error {
	if g.list[value] != nil {
		return errors.New("Vertex already exists: " + value)
	}
	g.list[value] = make([]*Edge, 0)
	g.vertices = append(g.vertices, &Vertex{value: value})
	return nil
}

// AddAllVertices adds a list of vertices to the graph.
func (g *AdjacencyList) AddAllVertices(values []string) error {
	var err error
	for _, value := range values {
		temp := g.AddVertex(value)
		if temp != nil {
			err = temp
		}
	}
	return err
}

// RemoveVertex removes a vertex from the graph.
func (g *AdjacencyList) RemoveVertex(value string) error {
	if g.list[value] == nil {
		return errors.New("Vertex does not exist: " + value)
	}
	for key := range g.list {
		g.list[key] = removeFromEdgesArrayContaining(g.list[key], value)
	}
	delete(g.list, value)
	// Remove from the vertices array.
	g.vertices = removeFromVertexArray(g.vertices, value)
	// Remove all edges that contain the vertex from the edges array.
	g.edges = removeFromEdgesArrayContaining(g.edges, value)
	return nil
}

// AddEdge adds a new edge to the graph.
func (g *AdjacencyList) AddEdge(from string, to string, weight int) error {
	if g.list[from] == nil || g.list[to] == nil {
		return errors.New("Vertices do not exist in graph: " + from + ", " + to)
	}
	g.list[from] = append(g.list[from], &Edge{vertices: [2]string{from, to}, weight: weight})
	g.edges = append(g.edges, &Edge{vertices: [2]string{from, to}, weight: weight})
	return nil
}

// RemoveEdge removes an edge from the graph.
func (g *AdjacencyList) RemoveEdge(from string, to string) error {
	if g.list[from] == nil {
		return errors.New("Edge does not exist in graph: " + from + "->" + to)
	}
	removed := removeFromEdgesArray(g.edges, from, to)
	if len(removed) >= len(g.edges) {
		return errors.New("Edge does not exist in graph: " + from + "->" + to)
	}
	g.edges = removed
	return nil
}

// Clear removes all nodes from the graph.
func (g *AdjacencyList) Clear() {
	g.list = map[string][]*Edge{}
	g.vertices = make([]*Vertex, 0)
	g.edges = make([]*Edge, 0)
}

// IsEmpty returns true if the graph is empty.
func (g *AdjacencyList) IsEmpty() bool {
	return len(g.vertices) == 0
}

// DFS performs a depth first traversal from the source vertex.
func (g *AdjacencyList) DFS(source string) []string {
	temp := make([]string, 0)
	result := &temp
	dfsHelper(g.getVertex(source), &result, g)
	return *result
}

// BFS performs a breadth first traversal from the source vertex.
func (g *AdjacencyList) BFS(source string) []string {
	// The front of the slice represents the front of the queue.
	vertex := g.getVertex(source)
	result := []string{vertex.value}
	queue := []*Vertex{vertex}
	for len(queue) > 0 {
		front := queue[0]
		queue = queue[1:]
		neighbours := g.getNeighbours(front)
		for _, neighbour := range neighbours {
			if !didVisit(result, neighbour) {
				result = append(result, neighbour.value)
				queue = append(queue, neighbour)
			}
		}
	}
	return result
}

// Dijkstra finds the shortest path to all vertices in the graph from the source vertex.
func (g *AdjacencyList) Dijkstra(source string) {
	g.resetPath()
	pq := &PriorityQueue{}
	sourceVertex := g.getVertex(source)
	sourceVertex.distance = 0
	pq.Enqueue(sourceVertex)
	for !pq.IsEmpty() {
		vertex, _ := pq.Dequeue()
		edges := g.getOutgoingEdges(vertex)
		for _, edge := range edges {
			var destID string
			if vertex.value == edge.vertices[0] {
				destID = edge.vertices[1]
			} else {
				destID = edge.vertices[0]
			}
			destVertex := g.getVertex(destID)
			newDistance := edge.weight + vertex.distance

			if newDistance < destVertex.distance {
				destVertex.distance = newDistance
				destVertex.previous = vertex
				pq.Enqueue(destVertex)
			}
		}
	}
}

// GetShortestPath returns the shortest path between the target and Dijkstra's source.
func (g *AdjacencyList) GetShortestPath(target string) ([]*DijkstraResult, error) {
	result := make([]*DijkstraResult, 0)
	currentNode := g.getVertex(target)
	if currentNode.previous == nil {
		return nil, errors.New("Vertex cannot be reached: " + target)
	}
	for currentNode != nil {
		result = append(result, &DijkstraResult{Value: currentNode.value, Distance: currentNode.distance})
		currentNode = currentNode.previous
	}
	// Reverse the result.
	for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
		result[i], result[j] = result[j], result[i]
	}
	return result, nil
}

// NumberOfVertices returns the number of vertices in the graph.
func (g *AdjacencyList) NumberOfVertices() int {
	return len(g.vertices)
}

// NumberOfEdges returns the number of vertices in the graph.
func (g *AdjacencyList) NumberOfEdges() int {
	return len(g.edges)
}

func (g *AdjacencyList) getVertex(value string) *Vertex {
	for _, vertex := range g.vertices {
		if vertex.value == value {
			return vertex
		}
	}
	return nil
}

func (g *AdjacencyList) getOutgoingEdges(vertex *Vertex) []*Edge {
	return g.list[vertex.value]
}

func (g *AdjacencyList) getNeighbours(vertex *Vertex) []*Vertex {
	edges := g.getOutgoingEdges(vertex)
	result := make([]*Vertex, 0)
	for _, edge := range edges {
		if edge.vertices[0] == vertex.value {
			result = append(result, g.getVertex(edge.vertices[1]))
		} else {
			result = append(result, g.getVertex(edge.vertices[0]))
		}
	}
	return result
}

func (g *AdjacencyList) resetPath() {
	for _, vertex := range g.vertices {
		vertex.distance = math.MaxInt32
		vertex.previous = nil
	}
}
