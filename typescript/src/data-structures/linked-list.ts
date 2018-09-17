export class LinkedListNode<T> {
  constructor(private _value: T, private _prev: LinkedListNode<T>, private _next: LinkedListNode<T>) {}

  get value() {
    return this._value;
  }

  get prev() {
    return this._prev;
  }

  get next() {
    return this._next;
  }

  set value(_value: T) {
    this._value = _value;
  }

  set prev(_prev: LinkedListNode<T>) {
    this._prev = _prev;
  }

  set next(_next: LinkedListNode<T>) {
    this._next = _next;
  }
}

export class LinkedList<T> {
  protected _head: LinkedListNode<T>;
  private _tail: LinkedListNode<T>;
  private _size: number;

  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
  }

  /** Add a new value to the end of the list. */
  append(value: T) {
    const newNode = new LinkedListNode<T>(value, this._tail, undefined);
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

  /** Appends a list of items sequentially. */
  appendAll(items: T[] | LinkedList<T>) {
    if (Array.isArray(items)) {
      items.forEach(item => this.append(item));
    } else {
      items.forEach(item => this.append(item));
    }
  }

  /** Insert a new value at an index. */
  add(value: T, index: number) {
    if (index > this._size || index < 0) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    if (this.size === 0) {
      return this.append(value);
    }

    const newNode = new LinkedListNode<T>(value, undefined, undefined);
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

  /** Get the value at an index. */
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

  /** Remove from the list by value. */
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

  /** Remove from the list by index. */
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

  /** Remove all nodes that satisfy a predicate. */
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

  /** Apply a function to all nodes in the list. */
  forEach(fn: (value: T, index?: number) => any) {
    let currentNode = this.head;
    let index = 0;
    while (currentNode) {
      fn(currentNode.value, index);
      currentNode = currentNode.next;
      index++;
    }
  }

  /** Map the list to an array. */
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

  /** Map the list to a linked list. */
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

  /** Filter the list by predicate to an array. */
  filterToArray(pred: (value: T, index?: number) => boolean) {
    const result: T[] = [];
    this.forEach((value, index) => {
      if (pred(value, index)) {
        result.push(value);
      }
    });
    return result;
  }

  /** Filter the list by predicate to a linked list. */
  filterToLinkedList(pred: (value: T, index?: number) => boolean) {
    const result = new LinkedList<T>();
    this.forEach((value, index) => {
      if (pred(value, index)) {
        result.append(value);
      }
    });
    return result;
  }

  /** Find the first occurence of a value that satisfies a predicate. */
  find(pred: (value: T, index?: number) => boolean) {
    const filtered = this.filterToArray(pred);
    if (filtered.length === 0) {
      return undefined;
    }
    return filtered[0];
  }

  /** Check if the list contains a value. */
  contains(target: T) {
    return this.indexOf(target) > -1;
  }

  /** Returns the index of a value, -1 if the value is not in the list. */
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

  /** Clears all nodes in the list. */
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
