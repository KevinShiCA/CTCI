import { MinStack, SetOfStacks, StackQueue, sortStack, AnimalShelter, Dog, Cat } from "../chapter3";
import { TestArrayStack } from "test/stack.jest";

describe("Chapter 3", () => {
  // 3.2 Min Stack
  it("should create a stack that can return the min value of the stack", () => {
    const stack = new MinStack();
    stack.push(3);
    stack.push(4);
    stack.push(-1);
    expect(stack.min()).toBe(-1);
    stack.push(5);
    stack.push(-10);
    expect(stack.min()).toBe(-10);
    expect(stack.pop()).toBe(-10);
    expect(stack.min()).toBe(-1);
    expect(stack.pop()).toBe(5);
  });

  // 3.3 Set of Stacks
  it("should create a set of stacks with a popAt(i) method", () => {
    let stack = new SetOfStacks<number>(3);
    stack.push(1);
    stack.push(2);
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toBe(2);
    stack.push(3);
    stack.push(4);
    expect(stack.size()).toBe(4);
    expect(stack.pop()).toBe(4);
    expect(stack.size()).toBe(3);
    stack.pushAll([4, 5, 6, 7, 8]);
    expect(stack.size()).toBe(8); // [1, 2, 3], [4, 5, 6], [7, 8]
    expect(stack.popAt(1)).toBe(6);
    expect(stack.popAt(1)).toBe(7);
    stack.push(9);
    expect(stack.popAt(2)).toBe(9);
    expect(() => stack.popAt(2)).toThrowError("Index out of bounds: 2");
    stack.clear();
    expect(stack.isEmpty()).toBeTruthy();
    expect(() => stack.peek()).toThrowError("Stack is empty");
    expect(() => stack.pop()).toThrowError("Stack is empty");
    stack = new SetOfStacks<number>(5);
    stack.pushAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(stack.popAt(0)).toBe(5);
    expect(stack.popAt(0)).toBe(6);
    stack.clear();
    stack.pushAll([1, 2]);
    stack.pop();
    stack.pop();
    expect(stack.isEmpty()).toBeTruthy();
  });

  // 3.4 Queue via Stacks
  it("should create a queue using two stacks", () => {
    const queue = new StackQueue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    expect(queue.size()).toBe(3);
    expect(queue.peek()).toBe(1);

    expect(queue.dequeue()).toBe(1);
    expect(queue.peek()).toBe(2);

    queue.enqueue(4);
    queue.enqueue(5);
    queue.enqueue(6);

    expect(queue.peek()).toBe(2);

    queue.clear();
    expect(queue.isEmpty()).toBeTruthy();
    expect(() => queue.peek()).toThrowError("Queue is empty");
    expect(() => queue.dequeue()).toThrowError("Queue is empty");
  });

  // 3.5 Stack Sort
  it("should sort a stack", () => {
    const stack = new TestArrayStack<number>();
    stack.pushAll([10, 7, 8, 15, -2, -4, 10, 2]);
    sortStack(stack);
    expect(stack.toArray().reverse()).toEqual([-4, -2, 2, 7, 8, 10, 10, 15]);
  });

  // 3.6 Animal Shelter
  it("should build an animal shelter", () => {
    const shelter = new AnimalShelter();
    shelter.addAnimal(new Dog("a"));
    shelter.addAnimal(new Dog("b"));
    shelter.addAnimal(new Cat("c"));
    expect(shelter.adoptAny().name).toBe("a");
    expect(shelter.adoptCat().name).toBe("c");
    shelter.addAnimal(new Cat("sheldon"));
    shelter.addAnimal(new Dog("d"));
    shelter.addAnimal(new Dog("e"));
    shelter.addAnimal(new Dog("f"));
    expect(shelter.adoptAny().name).toBe("b");
    expect(shelter.adoptAny().name).toBe("sheldon");
    expect(shelter.adoptAny().name).toBe("d");
    expect(shelter.adoptAny().name).toBe("e");
    expect(shelter.adoptAny().name).toBe("f");
    shelter.addAnimal(new Cat("x"));
    shelter.addAnimal(new Cat("y"));
    expect(shelter.adoptAny().name).toBe("x");
    expect(shelter.adoptCat().name).toBe("y");
  });
});
