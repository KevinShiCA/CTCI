import { DirectedWeightedAdjacencyMatrix, DirectedWeightedAdjacencyList } from "../graph-directed";
import { Serializable, Graph } from "../graph";
import { WeightedAdjacencyMatrix, WeightedAdjacencyList } from "../graph-weighted";

class Foo extends Serializable {
  constructor(private _value: string) {
    super();
  }

  id() {
    return this._value;
  }

  get value() {
    return this._value;
  }
}

function generateFoo(str: string): { [index: string]: Foo } {
  const result: { [index: string]: Foo } = {};
  str.split("").forEach(vertex => result[vertex] = new Foo(vertex));
  return result;
}

const vertices = generateFoo("abcdefg");

enum GraphType {
  Matrix = "matrix",
  List = "list"
}

/**
 * a: {c, 10}, {f, 7}
 * b: {c, 5}, {d, 14}
 * c: {f, 15}, {g, 6}
 * d: {a, 9}, {c, 4}, {f, 8}, {g, 6}
 * e: {a, 13}, {d, 2}
 * f: {b, 11}, {d, 10}
 * g: {a, 3}, {b, 3}, {e, 6}
 */
function resetToGraphA(graph: Graph<Foo>) {
  graph.clear();
  graph.addAllVertices(Object.values(vertices));
  graph.addEdge("a", "c", 10);
  graph.addEdge("a", "f", 7);
  graph.addEdge("b", "c", 5);
  graph.addEdge("b", "d", 14);
  graph.addEdge("c", "f", 15);
  graph.addEdge("c", "g", 6);
  graph.addEdge("d", "a", 9);
  graph.addEdge("d", "c", 4);
  graph.addEdge("d", "f", 8);
  graph.addEdge("d", "g", 6);
  graph.addEdge("e", "a", 13);
  graph.addEdge("e", "d", 2);
  graph.addEdge("f", "b", 11);
  graph.addEdge("f", "d", 10);
  graph.addEdge("g", "a", 3);
  graph.addEdge("g", "b", 3);
  graph.addEdge("g", "e", 6);
  expect(graph.numberOfVertices()).toBe(7);
  expect(graph.numberOfEdges()).toBe(17);
}

describe("Graph", () => {
  describe("Adjacency Matrix", () => {
    describe("Weighted Adjacency Matrix", () => {
      runWeightedGraphTests(GraphType.Matrix);

      describe("Directed Weighted Adjacency Matrix", () => {
        runDirectedWeightedGraphTests(GraphType.Matrix);
      });
    });
  });

  describe("Adjacency List", () => {
    describe("Weighted Adjacency List", () => {
      runWeightedGraphTests(GraphType.List);

      describe("Directed Weighted Adjacency List", () => {
        runDirectedWeightedGraphTests(GraphType.List);
      });
    });
  });
});

function runWeightedGraphTests(graphType: GraphType) {
  const graph = graphType === GraphType.Matrix ? new WeightedAdjacencyMatrix<Foo>() : new WeightedAdjacencyList<Foo>();

  it("should add and remove edges correctly", () => {
    graph.addAllVertices(Object.values(generateFoo("abc")));
    graph.addEdge("a", "c", 3);
    expect(graph.numberOfVertices()).toBe(3);
    expect(graph.numberOfEdges()).toBe(1);
    expect(graph.addEdge("d", "f", 100)).toBeFalsy();
    expect(graph.addEdge("a", "f", 100)).toBeFalsy();

    expect(graph.removeEdge("a", "b")).toBeFalsy();
    expect(graph.removeEdge("a", "f")).toBeFalsy();
    expect(graph.removeEdge("c", "a")).toBeTruthy();
    expect(graph.numberOfEdges()).toBe(0);

    graph.addEdge("c", "a", 3);
    expect(graph.numberOfEdges()).toBe(1);
    expect(graph.removeEdge("a", "c")).toBeTruthy();
    expect(graph.numberOfEdges()).toBe(0);
  });
}

function runDirectedWeightedGraphTests(graphType: GraphType) {
  let graph: DirectedWeightedAdjacencyList<Foo> | DirectedWeightedAdjacencyMatrix<Foo>;

  beforeEach(() => {
    graph = graphType === GraphType.Matrix ? new DirectedWeightedAdjacencyList() : new DirectedWeightedAdjacencyMatrix();
  });

  afterEach(() => {
    graph = undefined;
  });

  it("should add and remove vertices", () => {
    resetToGraphA(graph);

    expect(graph.addVertex(vertices["a"])).toBeFalsy();

    graph.removeVertex("a");
    expect(graph.numberOfVertices()).toBe(6);
    expect(graph.numberOfEdges()).toBe(12);

    graph.removeVertex("b");
    expect(graph.numberOfVertices()).toBe(5);
    expect(graph.numberOfEdges()).toBe(8);

    expect(graph.removeVertex("a")).toBeFalsy();
    expect(graph.removeVertex("b")).toBeFalsy();
    expect(graph.numberOfVertices()).toBe(5);
    expect(graph.numberOfEdges()).toBe(8);

    graph.removeEdge("d", "f");
    expect(graph.numberOfEdges()).toBe(7);

    expect(graph.removeEdge("e", "g")).toBeFalsy();
    expect(graph.numberOfEdges()).toBe(7);

    expect(graph.addEdge("a", "b", 100)).toBeFalsy();
    expect(graph.removeEdge("q", "z")).toBeFalsy();

    graph.clear();
    expect(graph.isEmpty()).toBeTruthy();
  });

  it("should execute DFS, BFS, and Dijkstra's algorithm", () => {
    resetToGraphA(graph);

    const dfs = graph.dfs("a");
    expect(dfs.map(x => x.value)).toEqual(["a", "c", "f", "b", "d", "g", "e"]);
    const bfs = graph.bfs("a");
    expect(bfs.map(x => x.value)).toEqual(["a", "c", "f", "g", "b", "d", "e"]);

    graph.dijkstra("a");
    expect(graph.getShortestPath("e").map(item => ({
      value: item.node.value,
      distance: item.distance
    }))).toEqual([
      { value: "a", distance: 0 },
      { value: "c", distance: 10 },
      { value: "g", distance: 16 },
      { value: "e", distance: 22 }
    ]);

    // Trying to access an island vertex.
    graph.addVertex(new Foo("h"));
    graph.dijkstra("a");
    expect(() => graph.getShortestPath("h")).toThrowError("Vertex cannot be reached: h");

    // Edge case with idential shortest paths.
    graph.clear();
    graph.addAllVertices(Object.values(generateFoo("abcd")));
    graph.addEdge("a", "b", 5);
    graph.addEdge("a", "c", 5);
    graph.addEdge("b", "d", 2);
    graph.addEdge("c", "d", 2);
    graph.dijkstra("a");
    expect(graph.getShortestPath("d").map(item => ({
      value: item.node.value,
      distance: item.distance
    }))).toEqual([
      { value: "a", distance: 0 },
      { value: "c", distance: 5 },
      { value: "d", distance: 7 }
    ]);
  });
}
