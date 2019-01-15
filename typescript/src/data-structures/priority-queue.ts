import { Queue, QueueNode } from "./queue";

export abstract class PriorityQueue<T> extends Queue<T> {
  /**
   * Priority goes high to low.
   * If predicate(a, b) = 1, then a has a higher priority than b.
   */
  protected predicate: (a: T, b: T) => 1 | 0 | -1;

  constructor(predicate: (a: T, b: T) => 1 | 0 | -1) {
    super();
    this.predicate = predicate;
  }
}

export class ArrayPriorityQueue<T> extends PriorityQueue<T> {
  private elems: T[];

  constructor(predicate: (a: T, b: T) => 1 | 0 | -1) {
    super(predicate);
    this.elems = [];
  }

  peek() {
    if (this.elems.length === 0) {
      throw new Error("Queue is empty");
    }
    return this.elems[0];
  }

  enqueue(elem: T) {
    this.elems.push(elem);
    this.elems = this.elems.sort(this.predicate).reverse();
  }

  dequeue() {
    if (this.elems.length === 0) {
      throw new Error("Queue is empty");
    }
    return this.elems.shift();
  }

  size() {
    return this.elems.length;
  }

  clear() {
    this.elems = [];
  }
}

export class LinkedPriorityQueue<T> extends PriorityQueue<T> {
  private head: QueueNode<T>;
  private _size: number;

  constructor(predicate: (a: T, b: T) => 1 | 0 | -1) {
    super(predicate);
    this.head = undefined;
    this._size = 0;
  }

  peek() {
    if (!this.head) {
      throw new Error("Queue is empty");
    }
    return this.head.value;
  }

  enqueue(value: T) {
    const node: QueueNode<T> = {
      value,
      next: undefined
    };

    if (!this.head) {
      this.head = node;
      this._size++;
      return;
    }

    if (this.size() === 1) {
      if (this.predicate(value, this.head.value) >= 0) {
        node.next = this.head;
        this.head = node;
      } else {
        this.head.next = node;
      }
      this._size++;
      return;
    }

    if (this.predicate(value, this.head.value) >= 0) {
      node.next = this.head;
      this.head = node;
      this._size++;
      return;
    }

    let previousNode = this.head;
    let currentNode = this.head.next;
    while (currentNode) {
      if (this.predicate(value, currentNode.value) >= 0) {
        break;
      }
      previousNode = currentNode;
      currentNode = currentNode.next;
    }
    node.next = currentNode;
    previousNode.next = node;
    this._size++;
  }

  dequeue() {
    if (!this.head) {
      throw new Error("Queue is empty");
    }

    const { value } = this.head;
    this.head = this.head.next;
    this._size--;

    return value;
  }

  size() {
    return this._size;
  }

  clear() {
    this.head = undefined;
    this._size = 0;
  }
}
