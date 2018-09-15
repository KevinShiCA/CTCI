package structures

// Vertex represents a string vertex in a directed weighted graph.
type Vertex struct {
	// Value is unique amongst vertices in the same graph.
	value string
	// Distance is the shortest distance from the source vertex.
	distance int
	// Used for Dijkstra's algorithm.
	previous *Vertex
}

// Edge represents a connection between two vertices in a directed weighted graph.
type Edge struct {
	vertices [2]string
	weight   int
	// Status is only used for the adjacency matrix implementation, it will be 1 if the edge exists and 0 if not.
	status int
}

// DijkstraResult represents a step in the shortest path traversal.
type DijkstraResult struct {
	Value    string
	Distance int
}

// DirectedWeightedGraph represents a directed weighted graph that can hold string nodes.
type DirectedWeightedGraph interface {
	AddVertex(value string) error                             // Adds a new vertex to the graph.
	AddAllVertices(values []string) error                     // Adds a list of vertices to the graph.
	RemoveVertex(value string) error                          // Removes a vertex from the graph.
	AddEdge(from string, to string, weight int) error         // Adds a new edge to the graph.
	RemoveEdge(from string, to string) error                  // Removes an edge from the graph.
	Clear()                                                   // Clears the graph.
	IsEmpty() bool                                            // True if the graph is empty.
	DFS(source string) []string                               // Depth first traversal.
	BFS(source string) []string                               // Breadth first traversal.
	Dijkstra(source string)                                   // Dijkstra's algorithm.
	GetShortestPath(target string) ([]*DijkstraResult, error) // To be used after a call to Dijkstra().
	NumberOfVertices() int                                    // Number of vertices in the graph.
	NumberOfEdges() int                                       // Number of edges in the graph.
	getVertex(value string) *Vertex                           // Get a vertex given its value.
	getOutgoingEdges(vertex *Vertex) []*Edge                  // Get the outgoing edges of a given vertex.
	getNeighbours(vertex *Vertex) []*Vertex                   // Get the neighbouring vertices of a given vertex.
	resetPath()                                               // Resets Dijkstra's path.
}

// Removes the given vertex from the vertices array.
func removeFromVertexArray(arr []*Vertex, value string) []*Vertex {
	for index, elem := range arr {
		if elem.value == value {
			return append(arr[:index], arr[index+1:]...)
		}
	}
	return arr
}

// Removes an edge from the edges array given from and to.
func removeFromEdgesArray(arr []*Edge, from string, to string) []*Edge {
	for index, edge := range arr {
		if edge.vertices[0] == from && edge.vertices[1] == to {
			return append(arr[:index], arr[index+1:]...)
		}
	}
	return arr
}

// Removes any edges in the edges array that contain a given vertex.
func removeFromEdgesArrayContaining(arr []*Edge, value string) []*Edge {
	result := make([]*Edge, 0)
	for _, edge := range arr {
		if edge.vertices[0] != value && edge.vertices[1] != value {
			result = append(result, edge)
		}
	}
	return result
}

// DFS and BFS helper.
// Returns true if the vertex has already been visited during the traversal.
func didVisit(visited []string, vertex *Vertex) bool {
	for _, v := range visited {
		if v == vertex.value {
			return true
		}
	}
	return false
}

// Generic DFS helper.
func dfsHelper(vertex *Vertex, result **[]string, g DirectedWeightedGraph) {
	temp := append(**result, vertex.value)
	*result = &temp
	neighbours := g.getNeighbours(vertex)
	for _, neighbour := range neighbours {
		if !didVisit(**result, neighbour) {
			dfsHelper(neighbour, result, g)
		}
	}
}
