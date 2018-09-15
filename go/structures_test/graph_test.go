package structures_test

import (
	"reflect"
	"testing"

	"../structures"
)

func TestGraph(t *testing.T) {
	matrix := &structures.AdjacencyMatrix{}
	testGraph(matrix, t)

	list := &structures.AdjacencyList{}
	testGraph(list, t)
}

func testGraph(graph structures.DirectedWeightedGraph, t *testing.T) {
	resetToGraphA(graph, t)
	err := graph.AddVertex("a")
	if err == nil {
		t.Error("Graph should have thrown error, vertex A already exists")
	}
	graph.RemoveVertex("a")
	testGraphNumberOfVertices(graph, 6, t)
	testGraphNumberOfEdges(graph, 12, t)

	graph.RemoveVertex("b")
	testGraphNumberOfVertices(graph, 5, t)
	testGraphNumberOfEdges(graph, 8, t)

	err = graph.RemoveVertex("a")
	if err == nil {
		t.Error("Graph should have thrown error, vertex A does not exist")
	}
	err = graph.RemoveVertex("b")
	if err == nil {
		t.Error("Graph should have thrown error, vertex B does not exist")
	}
	testGraphNumberOfVertices(graph, 5, t)
	testGraphNumberOfEdges(graph, 8, t)

	err = graph.RemoveEdge("d", "f")
	testError(err, t)
	testGraphNumberOfEdges(graph, 7, t)

	err = graph.RemoveEdge("e", "g")
	if err == nil {
		t.Error("Graph should have thrown error, edge E-G does not exist")
	}
	testGraphNumberOfEdges(graph, 7, t)

	err = graph.AddEdge("a", "b", 100)
	if err == nil {
		t.Error("Graph should have thrown error, edge A-B already exists")
	}

	err = graph.RemoveEdge("q", "z")
	if err == nil {
		t.Error("Graph should have thrown error, edge Q-Z does not exist")
	}
	graph.Clear()
	if !graph.IsEmpty() {
		t.Error("Graph should be empty after clearing")
	}

	resetToGraphA(graph, t)

	graph.Dijkstra("a")
	dijkstraResult, err := graph.GetShortestPath("e")
	testError(err, t)
	shortestPathLabels := make([]string, 0)
	shortestPathDistances := make([]int, 0)
	for _, item := range dijkstraResult {
		shortestPathLabels = append(shortestPathLabels, item.Value)
		shortestPathDistances = append(shortestPathDistances, item.Distance)
	}
	if !reflect.DeepEqual(shortestPathLabels, []string{"a", "c", "g", "e"}) {
		t.Error("Dijkstra path incorrect")
	}
	if !reflect.DeepEqual(shortestPathDistances, []int{0, 10, 16, 22}) {
		t.Error("Dijkstra distance incorrect")
	}

	graph.AddVertex("h")
	graph.Dijkstra("a")
	_, err = graph.GetShortestPath("h")
	if err == nil {
		t.Error("Graph should have thrown error, vertex H is unreachable")
	}
}

func testGraphNumberOfVertices(graph structures.DirectedWeightedGraph, expected int, t *testing.T) {
	if graph.NumberOfVertices() != expected {
		t.Errorf("Graph should contain %d vertices, got %d", expected, graph.NumberOfVertices())
	}
}

func testGraphNumberOfEdges(graph structures.DirectedWeightedGraph, expected int, t *testing.T) {
	if graph.NumberOfEdges() != expected {
		t.Errorf("Graph should contain %d edges, got %d", expected, graph.NumberOfEdges())
	}
}

func resetToGraphA(graph structures.DirectedWeightedGraph, t *testing.T) {
	graph.Clear()
	graph.AddAllVertices([]string{"a", "b", "c", "d", "e", "f", "g"})
	graph.AddEdge("a", "c", 10)
	graph.AddEdge("a", "f", 7)
	graph.AddEdge("b", "c", 5)
	graph.AddEdge("b", "d", 14)
	graph.AddEdge("c", "f", 15)
	graph.AddEdge("c", "g", 6)
	graph.AddEdge("d", "a", 9)
	graph.AddEdge("d", "c", 4)
	graph.AddEdge("d", "f", 8)
	graph.AddEdge("d", "g", 6)
	graph.AddEdge("e", "a", 13)
	graph.AddEdge("e", "d", 2)
	graph.AddEdge("f", "b", 11)
	graph.AddEdge("f", "d", 10)
	graph.AddEdge("g", "a", 3)
	graph.AddEdge("g", "b", 3)
	graph.AddEdge("g", "e", 6)
	testGraphNumberOfVertices(graph, 7, t)
	testGraphNumberOfEdges(graph, 17, t)
}
