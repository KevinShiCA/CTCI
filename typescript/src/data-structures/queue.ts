export abstract class Queue<T> {
  abstract peek(): T;

  abstract enqueue(value: T): void;

  abstract dequeue(): T;

  abstract size(): number;

  abstract clear(): void;

  isEmpty() {
    return this.size() === 0;
  }
}

export class ArrayQueue<T> extends Queue<T> {
  protected elems: T[];

  constructor() {
    super();
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

export interface QueueNode<T> {
  value: T;
  next: QueueNode<T>;
}

export class LinkedQueue<T> extends Queue<T> {
  protected head: QueueNode<T>;
  private _size: number;

  constructor() {
    super();
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

    let currentNode = this.head;
    while (currentNode.next) {
      currentNode = currentNode.next;
    }
    currentNode.next = node;
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
