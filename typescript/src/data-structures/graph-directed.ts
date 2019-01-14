import { Serializable } from "./graph";
import { WeightedAdjacencyMatrix, WeightedAdjacencyList } from "./graph-weighted";

/** The directed matrix works as follows: matrix[from][to]. */
export class DirectedWeightedAdjacencyMatrix<T extends Serializable> extends WeightedAdjacencyMatrix<T> {
  addEdge(fromId: string, toId: string, weight: number) {
    if (!this.matrix[fromId] || !this.matrix[fromId][toId]) {
      return false;
    }
    this.matrix[fromId][toId].status = 1;
    this.matrix[fromId][toId].weight = weight;
    this.matrix[fromId][toId].vertices = [fromId, toId];
    this.edges.push(this.matrix[fromId][toId]);
    return true;
  }

  removeEdge(fromId: string, toId: string) {
    if (!this.matrix[fromId]) {
      return false;
    }
    const edge = this.matrix[fromId][toId];
    if (!edge || edge.status === 0) {
      return false;
    }
    edge.status = 0;
    edge.weight = undefined;
    edge.vertices = [undefined, undefined];
    this.edges.splice(this.edges.findIndex(edge => edge.vertices[0] === fromId && edge.vertices[1] === toId), 1);
    return true;
  }
}

export class DirectedAdjacencyMatrix<T extends Serializable> extends DirectedWeightedAdjacencyMatrix<T> {
  addEdge(fromId: string, toId: string) {
    return super.addEdge(fromId, toId, 0);
  }
}

export class DirectedWeightedAdjacencyList<T extends Serializable> extends WeightedAdjacencyList<T> {
  addEdge(fromId: string, toId: string, weight: number) {
    if (!this.list[fromId] || !this.list[toId]) {
      return false;
    }
    this.list[fromId].append({ vertices: [fromId, toId], weight });
    this.edges.push({ vertices: [fromId, toId], weight });
    return true;
  }

  removeEdge(fromId: string, toId: string) {
    if (!this.list[fromId]) {
      return false;
    }
    const removed = this.list[fromId].removeAll(edge => edge.vertices[0] === fromId && edge.vertices[1] === toId);
    if (removed.length === 0) {
      return false;
    }
    this.edges.splice(this.edges.findIndex(edge => edge.vertices[0] === fromId && edge.vertices[1] === toId), 1);
    return true;
  }
}

export class DirectedAdjacencyList<T extends Serializable> extends DirectedWeightedAdjacencyList<T> {
  addEdge(fromId: string, toId: string) {
    return super.addEdge(fromId, toId, 0);
  }
}
