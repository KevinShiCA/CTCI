import { LinkedList, LinkedListNode } from "linked-list";
import {
  deleteDuplicatesBuffer,
  deleteDuplicatesNoBuffer,
  nthToLastRecursive,
  nthToLastIterative,
  deleteMiddleNode,
  partitionList,
  sumListsReverse,
  isListPalindrome,
  listIntersect,
  detectLoop
} from "../chapter2";

class TestLinkedList<T> extends LinkedList<T> {
  constructor(head: LinkedListNode<T> = undefined) {
    super();
    this._head = head;
  }
}

describe("Chapter 2: Linked Lists", () => {
  let ll: TestLinkedList<number>;

  beforeEach(() => {
    ll = new TestLinkedList<number>();
  });

  afterEach(() => {
    ll = undefined;
  });

  // 2.1 Remove Dups
  it("should delete duplicates from an unsorted linked list", () => {
    ll.appendAll([3, 4, 1, 2, 4, 1, 5, 6, 2, 1, 4, 3]);
    deleteDuplicatesBuffer(ll.head);
    expect(ll.toArray()).toEqual([3, 4, 1, 2, 5, 6]);
    ll.clear();
    ll.appendAll([3, 4, 1, 2, 4, 1, 5, 6, 2, 1, 4, 3]);
    deleteDuplicatesNoBuffer(ll.head);
    expect(ll.toArray()).toEqual([3, 4, 1, 2, 5, 6]);

    ll.clear();
    ll.appendAll([1, 2, 3, 4, 5]);
    deleteDuplicatesBuffer(ll.head);
    expect(ll.toArray()).toEqual([1, 2, 3, 4, 5]);
    ll.clear();
    ll.appendAll([1, 2, 3, 4, 5]);
    deleteDuplicatesNoBuffer(ll.head);
    expect(ll.toArray()).toEqual([1, 2, 3, 4, 5]);
  });

  // 2.2 Nth to Last
  it("should get the nth to last element in a linked list", () => {
    ll.appendAll([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(nthToLastRecursive(ll.head, 3)).toBe(7);
    expect(nthToLastIterative(ll.head, 3)).toBe(7);

    ll.clear();
    ll.append(2);
    expect(nthToLastRecursive(ll.head, 2)).toBeUndefined();
    expect(nthToLastIterative(ll.head, 2)).toBeUndefined();
  });

  // 2.3 Delete Middle Node
  it("should delete middle nodes only", () => {
    const a = new LinkedListNode<number>(1, undefined, undefined);
    const b = new LinkedListNode<number>(2, undefined, undefined);
    const c = new LinkedListNode<number>(3, undefined, undefined);
    // 1 -> 2 -> 3
    b.next = c;
    a.next = b;
    deleteMiddleNode(b);
    expect(a.next.value).toBe(3);
    expect(() => deleteMiddleNode(c)).toThrowError("Can only delete middle nodes");
  });

  // 2.4 Partition List
  it("should partition a linked list around a pivot", () => {
    ll.appendAll([3, 4, 1, 6, 8, 2, 9, 5]);
    ll = new TestLinkedList(partitionList(ll.head, 3));
    expect(ll.toArray()).toEqual([1, 2, 3, 4, 6, 8, 9, 5]);

    ll.clear();
    ll.appendAll([10, 40, 50, 20, 30, 60]);
    ll = new TestLinkedList(partitionList(ll.head, 25));
    expect(ll.toArray()).toEqual([10, 20, 40, 50, 30, 60]);

    ll.clear();
    ll.appendAll([1, 1, 1, 2, 3, 1, 2]);
    ll = new TestLinkedList(partitionList(ll.head, 1));
    expect(ll.toArray()).toEqual([1, 1, 1, 1, 2, 3, 2]);

    ll.clear();
    ll.appendAll([1, 1, 1, 2, 3, 1, 2]);
    ll = new TestLinkedList(partitionList(ll.head, 0));
    expect(ll.toArray()).toEqual([1, 1, 1, 2, 3, 1, 2]);

    ll.clear();
    ll.appendAll([1, 1, 1, 2, 3, 1, 2]);
    ll = new TestLinkedList(partitionList(ll.head, 4));
    expect(ll.toArray()).toEqual([1, 1, 1, 2, 3, 1, 2]);
  });

  // 2.5 Sum Lists
  it("should sum linked lists into a new linked list", () => {
    const ll1 = new LinkedList<number>();
    const ll2 = new LinkedList<number>();
    let ll3: TestLinkedList<number>;
    ll1.appendAll([7, 4, 2]);
    ll2.appendAll([4, 9, 8]);
    ll3 = new TestLinkedList(sumListsReverse(ll1.head, ll2.head));
    expect(ll3.toArray().reverse()).toEqual([1, 1, 4, 1]);

    ll1.clear();
    ll2.clear();
    ll1.appendAll([1, 2]);
    ll2.appendAll([5, 6, 2, 4, 7]);
    ll3 = new TestLinkedList(sumListsReverse(ll1.head, ll2.head));
    expect(ll3.toArray().reverse()).toEqual([7, 4, 2, 8, 6]);
    ll3 = new TestLinkedList(sumListsReverse(ll2.head, ll1.head));
    expect(ll3.toArray().reverse()).toEqual([7, 4, 2, 8, 6]);
  });

  // 2.6 Palindrome List
  it("should check if a linked list is a palindrome", () => {
    const ll1 = new LinkedList<string>();
    ll1.appendAll(["a", "b", "c", "d", "c", "b", "a"]);
    expect(isListPalindrome(ll1.head)).toBeTruthy();

    ll1.clear();
    ll1.appendAll(["a", "b", "c", "d", "d", "c", "b", "a"]);
    expect(isListPalindrome(ll1.head)).toBeTruthy();

    ll1.clear();
    ll1.appendAll(["a", "b", "c", "d", "e", "c", "b", "a"]);
    expect(isListPalindrome(ll1.head)).toBeFalsy();
  });

  // 2.7 List Intersection
  it("should check if two linked lists intersect", () => {
    const intersection = new LinkedListNode<number>(3, undefined, undefined);
    let ll1 = new LinkedListNode<number>(2, undefined, intersection);
    let ll2 = new LinkedListNode<number>(1, undefined,
      new LinkedListNode<number>(5, undefined,
        new LinkedListNode<number>(6, undefined, intersection)));
    expect(listIntersect(ll1, ll2).value).toBe(3);

    ll1 = new LinkedListNode<number>(1, undefined,
      new LinkedListNode<number>(5, undefined,
        new LinkedListNode<number>(6, undefined, intersection)));
    expect(listIntersect(ll1, ll2).value).toBe(3);

    ll.append(3);
    expect(listIntersect(ll.head, ll1)).toBeUndefined();
    ll2 = undefined;
    expect(listIntersect(ll1, ll2)).toBeUndefined();
  });

  // 2.8 Loop Detection
  it("should check if a linked list contains a loop", () => {
    const loop = new LinkedListNode<number>(3, undefined, undefined);
    loop.next = new LinkedListNode<number>(2, undefined,
      new LinkedListNode<number>(3, undefined,
        new LinkedListNode<number>(4, undefined, loop)));
    const ll1 = new LinkedListNode<number>(1, undefined, loop);
    expect(detectLoop(ll1)).toEqual(loop);

    ll.appendAll([1, 2, 3, 4, 5, 6]);
    expect(detectLoop(ll.head)).toBeUndefined();
  });
});
