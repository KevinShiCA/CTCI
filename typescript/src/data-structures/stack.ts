abstract class Stack<T> {
  abstract peek(): T;

  abstract push(elem: T): void;

  abstract pop(): T;

  abstract size(): number;

  abstract clear(): void;

  isEmpty() {
    return this.size() === 0;
  }
}

export class ArrayStack<T> extends Stack<T> {
  protected elems: T[];

  constructor() {
    super();
    this.elems = [];
  }

  peek() {
    if (this.elems.length === 0) {
      throw new Error("Stack is empty");
    }
    return this.elems[this.elems.length - 1];
  }

  push(elem: T) {
    this.elems.push(elem);
  }

  pop() {
    if (this.elems.length === 0) {
      throw new Error("Stack is empty");
    }
    return this.elems.pop();
  }

  size() {
    return this.elems.length;
  }

  clear() {
    this.elems = [];
  }
}

interface StackNode<T> {
  value: T;
  next: StackNode<T>;
}

export class LinkedStack<T> extends Stack<T> {
  protected top: StackNode<T>;
  private _size: number;

  constructor() {
    super();
    this.top = undefined;
    this._size = 0;
  }

  peek() {
    if (!this.top) {
      throw new Error("Stack is empty");
    }
    return this.top.value;
  }

  push(value: T) {
    const node: StackNode<T> = {
      value,
      next: this.top
    };
    this.top = node;
    this._size++;
  }

  pop() {
    if (!this.top) {
      throw new Error("Stack is empty");
    }
    const { value } = this.top;
    this.top = this.top.next;
    this._size--;

    return value;
  }

  size() {
    return this._size;
  }

  clear() {
    this.top = undefined;
    this._size = 0;
  }
}
