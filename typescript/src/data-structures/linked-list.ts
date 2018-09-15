class Node<T> {
  constructor(private _value: T, private _prev: Node<T>, private _next: Node<T>) {}

  get value() {
    return this._value;
  }

  get prev() {
    return this._prev;
  }

  get next() {
    return this._next;
  }

  set prev(_prev: Node<T>) {
    this._prev = _prev;
  }

  set next(_next: Node<T>) {
    this._next = _next;
  }
}

export class LinkedList<T> {
  private _head: Node<T>;
  private _tail: Node<T>;
  private _size: number;

  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
  }

  append(value: T) {
    const newNode = new Node<T>(value, this._tail, undefined);
    if (this._size === 0) {
      this._head = newNode;
      this._tail = newNode;
      this._size++;
      return;
    }

    this.tail.next = newNode;
    this._tail = newNode;
    this._size++;
  }

  appendAll(items: T[] | LinkedList<T>) {
    if (Array.isArray(items)) {
      items.forEach(item => this.append(item));
    } else {
      items.forEach(item => this.append(item));
    }
  }

  add(value: T, index: number) {
    if (index > this._size || index < 0) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    if (this.size === 0) {
      return this.append(value);
    }

    const newNode = new Node<T>(value, undefined, undefined);
    if (index === 0) {
      newNode.next = this.head;
      this._head = newNode;
      this._size++;
      return;
    }
    if (index === this._size) {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this._tail = newNode;
      this._size++;
      return;
    }

    let position = 0;
    let currentNode = this.head;
    while (position < index - 1) {
      currentNode = currentNode.next;
      position++;
    }
    newNode.next = currentNode.next;
    currentNode.next = newNode;
    newNode.prev = currentNode;
    this._size++;
  }

  get(index: number) {
    if (index >= this.size || index < 0) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    let position = 0;
    let currentNode = this.head;
    while (position < index) {
      currentNode = currentNode.next;
      position++;
    }
    return currentNode.value;
  }

  remove(value: T) {
    let currentNode = this.head;
    while (currentNode && currentNode.value !== value) {
      currentNode = currentNode.next;
    }
    if (currentNode) {
      if (currentNode === this.head) {
        this._head = this.head.next;
        if (this.head) {
          this.head.prev = undefined;
        }
        this._size--;
        return value;
      }
      if (currentNode === this.tail) {
        this._tail = this.tail.prev;
        if (this.tail) {
          this.tail.next = undefined;
        }
        this._size--;
        return value;
      }
      currentNode.prev.next = currentNode.next;
      currentNode.next.prev = currentNode.prev;
      this._size--;
      return value;
    }
    throw new Error(`Value not found: ${value}`);
  }

  removeAt(index: number) {
    if (index >= this.size || index < 0) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    if (this.size === 1) {
      const { value } = this.head;
      this.clear();
      return value;
    }
    if (index === 0) {
      const { value } = this.head;
      this._head = this.head.next;
      this.head.prev = undefined;
      this._size--;
      return value;
    }
    if (index === this.size - 1) {
      const { value } = this.tail;
      this._tail = this.tail.prev;
      this.tail.next = undefined;
      this._size--;
      return value;
    }

    let currentNode = this.head;
    let position = 0;
    while (position < index) {
      currentNode = currentNode.next;
      position++;
    }
    const { value } = currentNode;
    currentNode.prev.next = currentNode.next;
    currentNode.next.prev = currentNode.prev;
    this._size--;
    return value;
  }

  removeAll(pred: (value: T, index?: number) => boolean) {
    const result: T[] = [];
    this.forEach(value => {
      if (pred(value)) {
        result.push(value);
        this.remove(value);
      }
    });
    return result;
  }

  forEach(fn: (value: T, index?: number) => any) {
    let currentNode = this.head;
    let index = 0;
    while (currentNode) {
      fn(currentNode.value, index);
      currentNode = currentNode.next;
      index++;
    }
  }

  mapToArray(fn: (value: T, index?: number) => any) {
    const result: any[] = [];
    let currentNode = this.head;
    let index = 0;
    while (currentNode) {
      result.push(fn(currentNode.value, index));
      currentNode = currentNode.next;
      index++;
    }
    return result;
  }

  mapToLinkedList(fn: (value: T, index?: number) => any) {
    const result = new LinkedList<any>();
    let currentNode = this.head;
    let index = 0;
    while (currentNode) {
      result.append(fn(currentNode.value, index));
      currentNode = currentNode.next;
      index++;
    }
    return result;
  }

  filterToArray(pred: (value: T, index?: number) => boolean) {
    const result: T[] = [];
    this.forEach((value, index) => {
      if (pred(value, index)) {
        result.push(value);
      }
    });
    return result;
  }

  filterToLinkedList(pred: (value: T, index?: number) => boolean) {
    const result = new LinkedList<T>();
    this.forEach((value, index) => {
      if (pred(value, index)) {
        result.append(value);
      }
    });
    return result;
  }

  find(pred: (value: T, index?: number) => boolean) {
    const filtered = this.filterToArray(pred);
    if (filtered.length === 0) {
      return undefined;
    }
    return filtered[0];
  }

  contains(target: T) {
    return this.indexOf(target) > -1;
  }

  indexOf(value: T) {
    let currentNode = this._head;
    let index = 0;

    while (currentNode) {
      if (currentNode.value === value) {
        return index;
      }
      currentNode = currentNode.next;
      index++;
    }

    return -1;
  }

  clear() {
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  toString() {
    if (this.size === 0) {
      return "EMPTY LIST";
    }
    if (this.size === 1) {
      return `${this.head.value}`;
    }
    if (this.size === 2) {
      return `${this.head.value} -> ${this.tail.value}`;
    }

    let str = "";
    let currentNode = this.head;
    while (currentNode.next) {
      str += `${currentNode.value}`;
      str += " -> ";
      currentNode = currentNode.next;
    }
    str += currentNode.value;
    return str;
  }

  toArray() {
    return this.mapToArray(value => value) as T[];
  }

  get head() {
    return this._head;
  }

  get tail() {
    return this._tail;
  }

  get size() {
    return this._size;
  }
}
