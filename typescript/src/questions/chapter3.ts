import { LinkedStack, Stack } from "stack";
import { Queue, LinkedQueue } from "queue";

/**
 * 3.2 Stack Min: Design a stack that can return the min element of the stack in O(1) time.
 */
export class MinStack extends LinkedStack<number> {
  private minStack: LinkedStack<number>;

  constructor() {
    super();
    this.minStack = new LinkedStack();
  }

  push(elem: number) {
    if (elem < this.min()) {
      this.minStack.push(elem);
    }
    super.push(elem);
  }

  pop() {
    const value = super.pop();
    if (value === this.min()) {
      this.minStack.pop();
    }
    return value;
  }

  min() {
    if (this.minStack.isEmpty()) {
      return Number.MAX_VALUE;
    }
    return this.minStack.peek();
  }
}

/**
 * 3.3 Set of Stacks: Design a data structure SetOfStacks that creates new stacks if the previous
 * one exceeds a given capacity. The data structure should have all the regular stack methods,
 * along with popAt(stackIndex) that pops out of a given stack in the set.
 */

/** A stack with a fixed capacity that can also remove the bottom element. */
class CapacityStack<T> extends LinkedStack<T> {
  private capacity: number;

  constructor(capacity: number) {
    super();
    this.capacity = capacity;
  }

  isFull() {
    return this.size() >= this.capacity;
  }

  /** Time: O(n). Space: O(1). */
  removeBottom() {
    // This method cannot be called when the size is 0.
    if (this.size() === 1) {
      const value = this.top.value;
      this.top = undefined;
      this._size--;
      return value;
    }
    let currentNode = this.top;
    while (currentNode.next.next) {
      currentNode = currentNode.next;
    }
    const value = currentNode.next.value;
    currentNode.next = undefined;
    this._size--;
    return value;
  }
}

export class SetOfStacks<T> extends Stack<T> {
  stacks: CapacityStack<T>[];

  constructor(private capacity: number) {
    super();
    this.stacks = [];
  }

  push(elem: T) {
    const last = this.getLastStack();
    if (last && !last.isFull()) {
      last.push(elem);
    } else {
      const stack = new CapacityStack<T>(this.capacity);
      stack.push(elem);
      this.stacks.push(stack);
    }
  }

  pushAll(elems: T[]) {
    elems.forEach(elem => this.push(elem));
  }

  peek() {
    const last = this.getLastStack();
    if (!last) {
      throw new Error("Stack is empty");
    }
    return last.peek();
  }

  pop() {
    const last = this.getLastStack();
    if (!last) {
      throw new Error("Stack is empty");
    }
    const value = last.pop();
    if (last.size() === 0) {
      this.stacks.pop();
    }
    return value;
  }

  popAt(index: number) {
    if (index >= this.stacks.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    return this.popAtHelper(index, true);
  }

  private popAtHelper(index: number, removeTop: boolean) {
    const stack = this.stacks[index];
    const top = removeTop ? stack.pop() : stack.removeBottom();
    if (stack.isEmpty()) {
      this.stacks.splice(index, 1);
    } else if (this.stacks.length > index + 1) {
      stack.push(this.popAtHelper(index + 1, false));
    }
    return top;
  }

  size() {
    if (this.stacks.length === 0) {
      return 0;
    }
    return this.stacks.reduce((acc, stack) => acc + stack.size(), 0);
  }

  clear() {
    this.stacks = [];
  }

  private getLastStack() {
    if (this.stacks.length === 0) {
      return undefined;
    }
    return this.stacks[this.stacks.length - 1];
  }
}

/**
 * 3.4 Queue via Stacks: Implement a class StackQueue that implements a queue using two stacks.
 */
export class StackQueue<T> extends Queue<T> {
  /** Newly enqueued elements at the top. */
  private stackNew: Stack<T>;
  /** Older enqueued elements at the top. */
  private stackOld: Stack<T>;

  constructor() {
    super();
    this.stackNew = new LinkedStack();
    this.stackOld = new LinkedStack();
  }

  /** Time: O(n). Space: O(1). */
  peek() {
    this.shiftStacks();
    return this.stackOld.peek();
  }

  enqueue(elem: T) {
    this.stackNew.push(elem);
  }

  /** Time: O(n). Space: O(1). */
  dequeue() {
    this.shiftStacks();
    return this.stackOld.pop();
  }

  size() {
    return this.stackNew.size() + this.stackOld.size();
  }

  clear() {
    this.stackNew = new LinkedStack();
    this.stackOld = new LinkedStack();
  }

  /**
   * Moves contents from the new stack to the old stack.
   * Time: O(n). Space: O(1).
   */
  private shiftStacks() {
    if (this.stackNew.isEmpty() && this.stackOld.isEmpty()) {
      throw new Error("Queue is empty");
    }
    if (this.stackOld.isEmpty()) {
      while (!this.stackNew.isEmpty()) {
        this.stackOld.push(this.stackNew.pop());
      }
    }
  }
}

/**
 * 3.5 Sort Stack: Implement an algorithm to sort a stack such that the smallest elements are on top.
 * An additional temporary stack is allowed, but no other data structures.
 * Assume that the stack supports push, pop, peek, and isEmpty all at O(1) time and space.
 */

/** Time: O(n^2). Space: O(n). */
export function sortStack(stack: Stack<number>) {
  const temp = new LinkedStack<number>();
  while (!stack.isEmpty()) {
    const value = stack.pop();
    // Insert the values into the temp stack in reverse sorted order.
    while (!temp.isEmpty() && temp.peek() > value) {
      stack.push(temp.pop());
    }
    temp.push(value);
  }
  while (!temp.isEmpty()) {
    stack.push(temp.pop());
  }
}

/**
 * 3.6 Animal Shelter: An animal shelter, which holds only dogs and cats, operates on a FIFO
 * basis. People can either adopt the oldest (based on arrival time) animal there, or they can
 * choose either dog or cat and adopt the oldest animal of that type. Create a data structrure
 * to implement this system. The data structure should support addAnimal, adoptAny, adoptDog,
 * and adoptCat. Use a queue in your implementation.
 */
class Animal {
  order: number;

  constructor(public name: string) {}

  olderThan(other: Animal) {
    return this.order < other.order;
  }
}

export class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
}

export class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }
}

export class AnimalShelter {
  private dogs: LinkedQueue<Dog>;
  private cats: LinkedQueue<Cat>;
  private order: number;

  constructor() {
    this.dogs = new LinkedQueue();
    this.cats = new LinkedQueue();
    this.order = 0;
  }

  addAnimal(a: Animal) {
    a.order = this.order;
    this.order++;
    if (a instanceof Dog) {
      this.dogs.enqueue(a);
    } else {
      this.cats.enqueue(a);
    }
  }

  adoptAny() {
    if (this.dogs.size() === 0) {
      return this.adoptCat();
    }
    if (this.cats.size() === 0) {
      return this.adoptDog();
    }
    const dog = this.dogs.peek();
    const cat = this.cats.peek();
    if (dog.olderThan(cat)) {
      return this.adoptDog();
    }
    return this.adoptCat();
  }

  adoptDog() {
    return this.dogs.dequeue();
  }

  adoptCat() {
    return this.cats.dequeue();
  }
}
