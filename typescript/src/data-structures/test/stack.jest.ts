import { ArrayStack, LinkedStack } from "../stack";

export class TestArrayStack<T> extends ArrayStack<T> {
  pushAll(elems: T[]) {
    elems.forEach(elem => this.push(elem));
  }

  toArray() {
    return this.elems;
  }
}

class TestLinkedStack<T> extends LinkedStack<T> {
  toArray() {
    const result: T[] = [];
    let currentNode = this.top;
    while (currentNode.next) {
      result.unshift(currentNode.value);
      currentNode = currentNode.next;
    }
    result.unshift(currentNode.value);
    return result;
  }
}

describe("Stack", () => {
  describe("Array stack", () => {
    it("should push and pop correctly", () => {
      const stack = new TestArrayStack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.peek()).toBe(3);
      expect(stack.size()).toBe(3);

      expect(stack.pop()).toBe(3);
      expect(stack.toArray()).toEqual([1, 2]);

      stack.push(4);
      stack.push(5);
      stack.push(6);

      expect(stack.toArray()).toEqual([1, 2, 4, 5, 6]);

      stack.clear();

      expect(stack.isEmpty()).toBeTruthy();
      expect(() => stack.peek()).toThrowError("Stack is empty");
      expect(() => stack.pop()).toThrowError("Stack is empty");
    });
  });

  describe("Linked stack", () => {
    it("should push and pop correctly", () => {
      const stack = new TestLinkedStack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.peek()).toBe(3);
      expect(stack.size()).toBe(3);

      expect(stack.pop()).toBe(3);
      expect(stack.toArray()).toEqual([1, 2]);

      stack.push(4);
      stack.push(5);
      stack.push(6);

      expect(stack.toArray()).toEqual([1, 2, 4, 5, 6]);

      stack.clear();

      expect(stack.isEmpty()).toBeTruthy();
      expect(() => stack.peek()).toThrowError("Stack is empty");
      expect(() => stack.pop()).toThrowError("Stack is empty");
    });
  });
});
