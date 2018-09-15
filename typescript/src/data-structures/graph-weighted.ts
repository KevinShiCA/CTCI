import {
  AdjacencyList,
  AdjacencyListVertex,
  AdjacencyListEdge,
  AdjacencyMatrixVertex,
  AdjacencyMatrixEdge,
  AdjacencyMatrix,
  Serializable
} from "./graph";
import { PriorityQueue, LinkedPriorityQueue } from "./priority-queue";
import { LinkedList } from "./linked-list";

interface WeightedAdjacencyMatrixVertex<T extends Serializable> extends AdjacencyMatrixVertex<T> {
  /** Represents the weighted distance to the source vertex. */
  distance?: number;
  /** Used in Dijkstra's algorithm. */
  previous?: WeightedAdjacencyMatrixVertex<T>;
}

interface WeightedAdjacencyMatrixEdge extends AdjacencyMatrixEdge {
  /** Weight of the edge. */
  weight: number;
}

interface WeightedAdjacencyListVertex<T extends Serializable> extends AdjacencyListVertex<T> {
  /** Represents the weighted distance to the source vertex. */
  distance?: number;
  /** Used in Dijkstra's algorithm. */
  previous?: WeightedAdjacencyListVertex<T>;
}

interface WeightedAdjacencyListEdge extends AdjacencyListEdge {
  /** Weight of the edge. */
  weight: number;
}

const predicate = (a: (WeightedAdjacencyMatrixVertex<any> | WeightedAdjacencyListVertex<any>),
                   b: (WeightedAdjacencyMatrixVertex<any> | WeightedAdjacencyListVertex<any>)) => {
  if (a.distance < b.distance) {
    return 1;
  }
  if (a.distance === b.distance) {
    return 0;
  }
  return -1;
};

export class WeightedAdjacencyMatrix<T extends Serializable> extends AdjacencyMatrix<T> {
  protected matrix: Record<string, Record<string, WeightedAdjacencyMatrixEdge>>;
  protected vertices: WeightedAdjacencyMatrixVertex<T>[];
  protected edges: WeightedAdjacencyMatrixEdge[];

  addEdge(aId: string, bId: string, weight: number) {
    if (!this.matrix[aId] || !this.matrix[bId]) {
      return false; // Vertices do not exist.
    }
    this.matrix[aId][bId].status = 1;
    this.matrix[aId][bId].weight = weight;
    this.matrix[aId][bId].vertices = [aId, bId];
    this.matrix[bId][aId].status = 1;
    this.matrix[bId][aId].weight = weight;
    this.matrix[bId][aId].vertices = [aId, bId];
    this.edges.push(this.matrix[aId][bId]);
    return true;
  }

  removeEdge(aId: string, bId: string) {
    if (!this.matrix[aId] || !this.matrix[bId]) {
      return false; // Edge does not exist.
    }
    const edge1 = this.matrix[aId][bId];
    const edge2 = this.matrix[bId][aId];
    if (edge1.status === 0 || edge2.status === 0) {
      return false; // Edge does not exist.
    }
    edge1.status = 0;
    edge1.weight = undefined;
    edge1.vertices = [undefined, undefined];
    edge2.status = 0;
    edge2.weight = undefined;
    edge2.vertices = [undefined, undefined];
    this.edges.splice(this.edges.findIndex(edge => {
      return (edge.vertices[0] === aId && edge.vertices[1] === bId) ||
             (edge.vertices[1] === aId && edge.vertices[0] === bId);
    }), 1);
    return true;
  }

  /** Execute Dijkstra's algorithm on the given source node. */
  dijkstra(sourceId: string) {
    this.resetPath();
    const pq: PriorityQueue<WeightedAdjacencyMatrixVertex<T>> = new LinkedPriorityQueue(predicate);
    const sourceVertex = this.getVertex(sourceId);
    sourceVertex.distance = 0;
    pq.enqueue(sourceVertex);
    while (!pq.isEmpty()) {
      const vertex = pq.dequeue();
      const edges = this.getOutgoingEdges(vertex);

      edges.forEach(edge => {
        const destId = (vertex.value.id() === edge.vertices[0] ?
          edge.vertices[1] : edge.vertices[0]);
        const newDistance = edge.weight + vertex.distance;
        const destVertex = this.getVertex(destId);

        if (newDistance < destVertex.distance) {
          destVertex.distance = newDistance;
          destVertex.previous = vertex;
          pq.enqueue(destVertex);
        }
      });
    }
  }

  /**
   * To be used after executing Dijkstra's algorithm.
   * @returns The shortest path between the target node and Dijkstra's source.
   */
  getShortestPath(targetId: string): { node: T, distance: number }[] {
    const result: WeightedAdjacencyMatrixVertex<T>[] = [];
    let currentNode = this.getVertex(targetId);
    if (!currentNode.previous) {
      throw new Error(`Vertex cannot be reached: ${targetId}`);
    }
    while (currentNode) {
      result.push(currentNode);
      currentNode = currentNode.previous;
    }
    return result.reverse().map(vertex => ({
      node: vertex.value,
      distance: vertex.distance
    }));
  }

  protected getVertex(vertexId: string) {
    return super.getVertex(vertexId) as WeightedAdjacencyMatrixVertex<T>;
  }

  protected getOutgoingEdges(vertex: WeightedAdjacencyMatrixVertex<T>) {
    return super.getOutgoingEdges(vertex) as WeightedAdjacencyMatrixEdge[];
  }

  /** Resets Dijkstra's path. */
  private resetPath() {
    this.vertices.forEach(vertex => {
      vertex.distance = Number.MAX_VALUE;
      vertex.previous = undefined;
    });
  }
}

export class WeightedAdjacencyList<T extends Serializable> extends AdjacencyList<T> {
  /**
   * The adjacency list.
   * The list contains linked lists representing adjacencies for each vertex.
   * It is implemented using a record of strings and linked lists, where the string is the vertex ID.
   */
  protected list: Record<string, LinkedList<WeightedAdjacencyListEdge>>;

  protected vertices: WeightedAdjacencyListVertex<T>[];
  protected edges: WeightedAdjacencyListEdge[];

  addEdge(aId: string, bId: string, weight: number) {
    if (!this.list[aId] || !this.list[bId]) {
      return false;
    }
    this.list[aId].append({ vertices: [aId, bId], weight });
    this.list[bId].append({ vertices: [bId, aId], weight });
    this.edges.push({ vertices: [aId, bId], weight });
    return true;
  }

  removeEdge(aId: string, bId: string) {
    if (!this.list[aId] || !this.list[bId]) {
      return false;
    }
    const resultA = this.list[aId].removeAll(edge => !!edge.vertices.find(vertexId => vertexId === bId));
    const resultB = this.list[bId].removeAll(edge => !!edge.vertices.find(vertexId => vertexId === aId));
    if (resultA.concat(resultB).length === 0) {
      return false;
    }
    this.edges = this.edges.filter(edge => {
      return !(edge.vertices.indexOf(aId) > -1 && edge.vertices.indexOf(bId) > -1);
    });
    return true;
  }

  /** Execute Dijkstra's algorithm on the given source node. */
  dijkstra(sourceId: string) {
    this.resetPath();
    const pq: PriorityQueue<WeightedAdjacencyListVertex<T>> = new LinkedPriorityQueue(predicate);
    const sourceVertex = this.getVertex(sourceId);
    sourceVertex.distance = 0;
    pq.enqueue(sourceVertex);
    while (!pq.isEmpty()) {
      const vertex = pq.dequeue();
      const edges = this.getOutgoingEdges(vertex);

      edges.forEach(edge => {
        const destId = (vertex.value.id() === edge.vertices[0] ?
          edge.vertices[1] : edge.vertices[0]);
        const destVertex = this.getVertex(destId);
        const newDistance = edge.weight + vertex.distance;

        if (newDistance < destVertex.distance) {
          destVertex.distance = newDistance;
          destVertex.previous = vertex;
          pq.enqueue(destVertex);
        }
      });
    }
  }

  /**
   * To be used after executing Dijkstra's algorithm.
   * @returns The shortest path between the target node and Dijkstra's source.
   */
  getShortestPath(targetId: string): { node: T, distance: number }[] {
    const result: WeightedAdjacencyListVertex<T>[] = [];
    let currentNode = this.getVertex(targetId);
    if (!currentNode.previous) {
      throw new Error(`Vertex cannot be reached: ${targetId}`);
    }
    while (currentNode) {
      result.push(currentNode);
      currentNode = currentNode.previous;
    }
    return result.reverse().map(vertex => ({
      node: vertex.value,
      distance: vertex.distance
    }));
  }

  protected getVertex(vertexId: string) {
    return super.getVertex(vertexId) as WeightedAdjacencyListVertex<T>;
  }

  protected getOutgoingEdges(vertex: WeightedAdjacencyListVertex<T>) {
    return super.getOutgoingEdges(vertex) as WeightedAdjacencyListEdge[];
  }

  /** Resets Dijkstra's path. */
  private resetPath() {
    this.vertices.forEach(vertex => {
      vertex.distance = Number.MAX_VALUE;
      vertex.previous = undefined;
    });
  }
}
