import { LinkedList } from "./linked-list";
import { Queue, LinkedQueue } from "./queue";

/**
 * Represents any Serializable class that can be uniquely identified by a string ID.
 */
export abstract class Serializable {
  abstract id(): string;
}

/**
 * A graph vertex that can hold any data.
 */
interface Vertex<T> {
  value: T;
}

/**
 * A basic graph edge contains two vertex IDs.
 * In a directed graph, vertices[0] represents from and vertices[1] represents to.
 */
interface Edge {
  vertices: [string, string];
}

/** An adjacency matrix vertex must hold serializable data. */
export interface AdjacencyMatrixVertex<T extends Serializable> extends Vertex<T> {
}

/**
 * Represents an edge inside the adjacency matrix.
 * If status is 1, then an edge is present.
 */
export interface AdjacencyMatrixEdge extends Edge {
  status: 0 | 1;
}

/**
 * An adjacency list vertex must hold serializable data.
 */
export interface AdjacencyListVertex<T extends Serializable> extends Vertex<T> {
}

export interface AdjacencyListEdge extends Edge {
  /** For naming consistency. */
}

export abstract class Graph<T> {
  protected vertices: Vertex<T>[];
  protected edges: Edge[];

  constructor() {
    this.vertices = [];
    this.edges = [];
  }

  /**
   * Adds a new vertex to the graph.
   * @returns True if successful.
   */
  abstract addVertex(value: T): boolean;

  /**
   * Removes the vertex with a given ID.
   * @returns True if successful.
   */
  abstract removeVertex(id: string): boolean;

  /**
   * Adds a new edge to the graph.
   * @returns True if successful.
   */
  abstract addEdge(aId: string, bId: string, weight?: number): boolean;

  /**
   * Removes the edge from vertex a to vertex b from the graph.
   * @returns True if successful.
   */
  abstract removeEdge(aId: string, bId: string): boolean;

  /** Clears the graph. */
  abstract clear(): void;

  /** Get the vertex with a given ID. */
  protected abstract getVertex(id: string): Vertex<T>;

  /** Get the outgoing edges of a given vertex. */
  protected abstract getOutgoingEdges(vertex: Vertex<T>): Edge[];

  /** Get the neighbouring vertices of a given vertex. */
  protected abstract getNeighbours(vertex: Vertex<T>): Vertex<T>[];

  /**
   * Helper for DFS and BFS.
   * @returns True if the vertex has been visited during the traversal.
   */
  protected abstract didVisit(visited: T[], vertex: Vertex<T>): boolean;

  /**
   * Depth first traversal.
   * @returns An array containing the traversal.
   */
  dfs(sourceId: string) {
    const result: T[] = [];
    this.dfsHelper(this.getVertex(sourceId), result);
    return result;
  }

  private dfsHelper(vertex: Vertex<T>, result: T[]) {
    result.push(vertex.value);
    const neighbours = this.getNeighbours(vertex);
    neighbours.forEach(neighbour => {
      if (!this.didVisit(result, neighbour)) {
        this.dfsHelper(neighbour, result);
      }
    });
  }

  /**
   * Breadth first traversal.
   * @returns An array containing the traversal.
   */
  bfs(sourceId: string) {
    const queue: Queue<Vertex<T>> = new LinkedQueue();
    const vertex = this.getVertex(sourceId);
    const result: T[] = [vertex.value];
    queue.enqueue(vertex);
    while (!queue.isEmpty()) {
      const front = queue.dequeue();
      const neighbours = this.getNeighbours(front);
      neighbours.forEach(neighbour => {
        if (!this.didVisit(result, neighbour)) {
          result.push(neighbour.value);
          queue.enqueue(neighbour);
        }
      });
    }
    return result;
  }

  /**
   * Adds a list of vertices to the graph.
   */
  addAllVertices(values: T[]) {
    let result = true;
    values.forEach(value => {
      const success = this.addVertex(value);
      result = result && success;
    });
    return result;
  }

  isEmpty() {
    return this.numberOfVertices() === 0;
  }

  numberOfVertices() {
    return this.vertices.length;
  }

  numberOfEdges() {
    return this.edges.length;
  }
}

export abstract class AdjacencyMatrix<T extends Serializable> extends Graph<T> {
  /**
   * The matrix is a Record of Records.
   * The string keys represent vertex IDs.
   * The contained edges are active if their status is 1.
   */
  protected matrix: Record<string, Record<string, AdjacencyMatrixEdge>>;

  protected vertices: AdjacencyMatrixVertex<T>[];
  protected edges: AdjacencyMatrixEdge[];

  constructor() {
    super();
    this.matrix = {};
  }

  addVertex(value: T) {
    const vertexId = value.id();
    if (this.matrix[vertexId]) {
      return false; // Vertex already exists.
    }
    const newRow: Record<string, AdjacencyMatrixEdge> = {};
    const oldVertices = Object.keys(this.matrix);

    oldVertices.forEach(key => {
      // Add new column to matrix.
      this.matrix[key][vertexId] = { vertices: [undefined, undefined], status: 0 };
      // Add old row keys onto the new row.
      newRow[key] = { vertices: [undefined, undefined], status: 0 };
    });
    newRow[vertexId] = { vertices: [undefined, undefined], status: 0 };
    this.matrix[vertexId] = newRow;
    this.vertices.push({ value });
    return true;
  }

  removeVertex(id: string) {
    if (!this.matrix[id]) {
      return false; // Vertex does not exist.
    }
    Object.keys(this.matrix).forEach(key => {
      delete this.matrix[key][id];
    });
    delete this.matrix[id];
    // Remove from the vertices array.
    this.vertices.splice(this.vertices.findIndex(vertex => vertex.value.id() === id), 1);
    // Remove all edges that contain the vertex from the edges array.
    this.edges = this.edges.filter(edge => edge.vertices.indexOf(id) === -1);
    return true;
  }

  clear() {
    this.matrix = {};
    this.vertices = [];
    this.edges = [];
  }

  protected getVertex(id: string) {
    return this.vertices.find(vertex => vertex.value.id() === id);
  }

  protected getOutgoingEdges(vertex: AdjacencyMatrixVertex<T>) {
    const vertexId = vertex.value.id();
    const result: AdjacencyMatrixEdge[] = [];
    Object.keys(this.matrix[vertexId]).forEach(key => {
      if (this.matrix[vertexId][key].status > 0) {
        result.push(this.matrix[vertexId][key]);
      }
    });
    return result;
  }

  protected getNeighbours(vertex: AdjacencyMatrixVertex<T>) {
    const edges = this.getOutgoingEdges(vertex);
    return edges.map(edge => vertex.value.id() === edge.vertices[0] ?
      this.getVertex(edge.vertices[1]) : this.getVertex(edge.vertices[0]));
  }

  protected didVisit(visited: T[], vertex: AdjacencyMatrixVertex<T>) {
    for (const node of visited) {
      if (node.id() === vertex.value.id()) {
        return true;
      }
    }
    return false;
  }
}

export abstract class AdjacencyList<T extends Serializable> extends Graph<T> {
  /**
   * The adjacency list.
   * The list contains linked lists representing adjacencies for each vertex.
   * It is implemented using a record of strings and linked lists, where the string is the vertex ID.
   */
  protected list: Record<string, LinkedList<AdjacencyListEdge>>;

  protected vertices: AdjacencyListVertex<T>[];
  protected edges: AdjacencyListEdge[];

  constructor() {
    super();
    this.list = {};
  }

  addVertex(value: T) {
    const vertexId = value.id();
    if (this.list[vertexId]) {
      return false; // Vertex already exists.
    }
    this.list[vertexId] = new LinkedList();
    this.vertices.push({ value });
    return true;
  }

  removeVertex(id: string) {
    if (!this.list[id]) {
      return false;
    }
    Object.keys(this.list).forEach(vertexId => {
      this.list[vertexId] = this.list[vertexId].filterToLinkedList(edge => {
        return edge.vertices.indexOf(id) === -1;
      });
    });
    delete this.list[id];
    // Remove from the vertices array.
    this.vertices.splice(this.vertices.findIndex(vertex => vertex.value.id() === id), 1);
    // Remove all edges that contain the vertex from the edges array.
    this.edges = this.edges.filter(edge => edge.vertices.indexOf(id) === -1);
    return true;
  }

  clear() {
    this.list = {};
    this.vertices = [];
    this.edges = [];
  }

  protected getNeighbours(vertex: AdjacencyListVertex<T>) {
    const edges = this.getOutgoingEdges(vertex);
    return edges.map(edge => vertex.value.id() === edge.vertices[0] ?
      this.getVertex(edge.vertices[1]) : this.getVertex(edge.vertices[0]));
  }

  protected getVertex(id: string) {
    return this.vertices.find(vertex => vertex.value.id() === id);
  }

  protected getOutgoingEdges(vertex: AdjacencyMatrixVertex<T>) {
    const vertexId = vertex.value.id();
    return this.list[vertexId].toArray();
  }

  protected didVisit(visited: T[], vertex: AdjacencyMatrixVertex<T>) {
    for (const node of visited) {
      if (node.id() === vertex.value.id()) {
        return true;
      }
    }
    return false;
  }
}
