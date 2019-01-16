import { BinarySearchTree } from "../binary-search-tree";
import { BinarySearchTreeA, BinarySearchTreeB } from "../tree.resources";
import { BinaryHeap, BinaryHeapType } from "../binary-heap";
import { BinaryTree, BinaryTreeNode, BinaryNodeRelationship, NaryTreeNode } from "../tree";
import { Trie } from "../trie";

class TestBinaryTree<T> extends BinaryTree<T> {
  insert() { return true; }

  getRelationship(a: BinaryTreeNode<T>, b: BinaryTreeNode<T>) { return super.getRelationship(a, b); }
}

class TestBinarySearchTree<T> extends BinarySearchTree<T> {
  getRoot() { return this.root.value; }
}

class TestTrie extends Trie {
  getRootNode() { return this.root; }

  getNumberOfChildren(node: NaryTreeNode<string>) { return this.numberOfChildren(node); }
}

const predicate = (a: number, b: number) => {
  if (a - b < 0) {
    return -1;
  }
  if (a - b > 0) {
    return 1;
  }
  return 0;
};

describe("Tree", () => {
  describe("Binary Tree", () => {
    it("should get the correct relationship between two nodes", () => {
      const a: BinaryTreeNode<string> = {
        value: "a",
        parent: undefined,
        left: undefined,
        right: undefined
      };
      const b: BinaryTreeNode<string> = {
        value: "b",
        parent: undefined,
        left: undefined,
        right: undefined
      };
      const tree = new TestBinaryTree<string>();
      expect(tree.getRelationship(a, b)).toEqual(BinaryNodeRelationship.None);

      a.left = b;
      expect(tree.getRelationship(a, b)).toEqual(BinaryNodeRelationship.LeftChild);
      a.left = undefined;

      a.right = b;
      expect(tree.getRelationship(a, b)).toEqual(BinaryNodeRelationship.RightChild);
      a.right = undefined;

      a.parent = b;
      expect(tree.getRelationship(a, b)).toEqual(BinaryNodeRelationship.Parent);
    });

    describe("Binary Search Tree", () => {
      function resetToTreeA() {
        bst.clear();
        bst.insertAll(BinarySearchTreeA);
        expect(bst.inOrder()).toEqual([25, 30, 50, 60, 80, 85, 90]);
      }
      function resetToTreeB() {
        bst.clear();
        bst.insertAll(BinarySearchTreeB);
        expect(bst.inOrder()).toEqual([-30, -1, 10, 20, 30, 50, 100, 200, 300, 400]);
      }
      let bst: TestBinarySearchTree<number>;

      beforeEach(() => {
        bst = new TestBinarySearchTree<number>(predicate);
      });

      afterEach(() => {
        bst = undefined;
      });

      it("should insert elements correctly", () => {
        bst.insert(4);
        bst.insert(-2);
        bst.insert(10);
        bst.insert(1000);
        bst.insert(3);
        expect(bst.size).toBe(5);
        expect(bst.inOrder()).toEqual([-2, 3, 4, 10, 1000]);

        bst.clear();
        expect(bst.isEmpty()).toBeTruthy();

        bst.insert(4);
        expect(bst.insert(4)).toBeFalsy();
        expect(bst.size).toBe(1);

        bst.clear();
        expect(bst.insertAll([1, 2, 3, 4, 5])).toBeTruthy();
        expect(bst.size).toBe(5);
        expect(bst.insertAll([4, 5, -1, -2, -3])).toBeFalsy();
        expect(bst.size).toBe(8);
        expect(bst.inOrder()).toEqual([-3, -2, -1, 1, 2, 3, 4, 5]);
      });

      it("should delete elements correctly", () => {
        // Delete leaves only.
        resetToTreeA();
        bst.delete(60);
        expect(bst.inOrder()).toEqual([25, 30, 50, 80, 85, 90]);
        bst.delete(85);
        expect(bst.inOrder()).toEqual([25, 30, 50, 80, 90]);
        bst.delete(90);
        expect(bst.inOrder()).toEqual([25, 30, 50, 80]);
        bst.delete(80);
        expect(bst.inOrder()).toEqual([25, 30, 50]);
        bst.delete(30);
        expect(bst.inOrder()).toEqual([25, 50]);
        bst.delete(25);
        expect(bst.inOrder()).toEqual([50]);

        // Delete nodes with one child.
        resetToTreeA();
        bst.delete(90);
        expect(bst.inOrder()).toEqual([25, 30, 50, 60, 80, 85]);
        bst.delete(25);
        expect(bst.inOrder()).toEqual([30, 50, 60, 80, 85]);

        // Delete non-existant nodes.
        expect(bst.delete(90)).toBeFalsy();
        expect(bst.delete(12345)).toBeFalsy();

        // Delete nodes with two children.
        resetToTreeB();
        bst.delete(-1);
        expect(bst.inOrder()).toEqual([-30, 10, 20, 30, 50, 100, 200, 300, 400]);
        bst.delete(10);
        expect(bst.inOrder()).toEqual([-30, 20, 30, 50, 100, 200, 300, 400]);
        bst.delete(20);
        expect(bst.inOrder()).toEqual([-30, 30, 50, 100, 200, 300, 400]);
        bst.delete(30);
        expect(bst.inOrder()).toEqual([-30, 50, 100, 200, 300, 400]);
        bst.delete(300);
        expect(bst.inOrder()).toEqual([-30, 50, 100, 200, 400]);
        bst.delete(400);
        expect(bst.inOrder()).toEqual([-30, 50, 100, 200]);
        bst.delete(100);
        expect(bst.inOrder()).toEqual([-30, 50, 200]);
        bst.delete(50);
        expect(bst.getRoot()).toBe(200);
        expect(bst.inOrder()).toEqual([-30, 200]);

        // Delete the root only.
        resetToTreeA();
        bst.delete(50);
        expect(bst.getRoot()).toBe(60);
        expect(bst.inOrder()).toEqual([25, 30, 60, 80, 85, 90]);
        bst.delete(60);
        expect(bst.getRoot()).toBe(80);
        expect(bst.inOrder()).toEqual([25, 30, 80, 85, 90]);
        bst.delete(80);
        expect(bst.getRoot()).toBe(85);
        expect(bst.inOrder()).toEqual([25, 30, 85, 90]);
        bst.delete(85);
        expect(bst.getRoot()).toBe(90);
        expect(bst.inOrder()).toEqual([25, 30, 90]);
        bst.delete(90);
        expect(bst.getRoot()).toBe(25);
        expect(bst.inOrder()).toEqual([25, 30]);
        bst.delete(25);
        expect(bst.getRoot()).toBe(30);
        expect(bst.inOrder()).toEqual([30]);
        bst.delete(30);
        expect(bst.isEmpty()).toBeTruthy();
        expect(bst.delete(0)).toBeFalsy();
      });

      it("should only find elements that exist", () => {
        // Tree is empty.
        expect(bst.search(123)).toBeFalsy();

        resetToTreeA();
        expect(bst.search(50)).toBeTruthy();
        expect(bst.search(85)).toBeTruthy();
        expect(bst.search(25)).toBeTruthy();
        expect(bst.search(123)).toBeFalsy();

        bst.delete(50);
        expect(bst.search(50)).toBeFalsy();
      });

      it("should get the depth of elements", () => {
        resetToTreeB();
        expect(bst.depth(50)).toBe(0);
        expect(bst.depth(100)).toBe(1);
        expect(bst.depth(20)).toBe(2);
        expect(bst.depth(200)).toBe(3);
        expect(bst.depth(10)).toBe(3);
        expect(bst.depth(123)).toBe(-1);
      });

      it("should do pre and post-order correctly", () => {
        expect(bst.preOrder()).toEqual([]);
        expect(bst.postOrder()).toEqual([]);

        resetToTreeA();
        expect(bst.preOrder()).toEqual([50, 25, 30, 80, 60, 90, 85]);
        expect(bst.postOrder()).toEqual([30, 25, 60, 85, 90, 80, 50]);

        resetToTreeB();
        expect(bst.preOrder()).toEqual([50, -1, -30, 20, 10, 30, 100, 300, 200, 400]);
        expect(bst.postOrder()).toEqual([-30, 10, 30, 20, -1, 200, 400, 300, 100, 50]);
      });
    });

    describe("Min heap", () => {
      let heap: BinaryHeap<number>;

      beforeEach(() => {
        heap = new BinaryHeap<number>(BinaryHeapType.Min, predicate);
      });

      afterEach(() => {
        heap = undefined;
      });

      it("should insert elements and remove top correctly", () => {
        // Basic insertion, no bubbling.
        heap.insertAll([3, 5, 6, 7, 8]);
        expect(heap.top()).toBe(3);
        expect(heap.removeTop()).toBe(3);
        expect(heap.size).toBe(4);
        expect(heap.top()).toBe(5);
        expect(heap.removeTop()).toBe(5);
        expect(heap.size).toBe(3);
        heap.clear();
        expect(heap.isEmpty()).toBeTruthy();

        // Complex insertion, lots of bubbling.
        heap.insertAll([5, 2, 9, -1, -2, 10, -10, 30, 3]);
        expect(heap.removeTop()).toBe(-10);
        expect(heap.removeTop()).toBe(-2);
        expect(heap.removeTop()).toBe(-1);
        expect(heap.removeTop()).toBe(2);
        expect(heap.removeTop()).toBe(3);
        expect(heap.removeTop()).toBe(5);
        expect(heap.removeTop()).toBe(9);
        expect(heap.removeTop()).toBe(10);
        expect(heap.removeTop()).toBe(30);
        expect(heap.isEmpty()).toBeTruthy();
        expect(() => heap.top()).toThrowError("Heap is empty");
        expect(() => heap.removeTop()).toThrowError("Heap is empty");

        // Edge case where one subtree is extremely clustered in value compared to the other.
        heap.insertAll([500, 1000, 1100, 2000, 1200, 3000, 1300, 4000, 1500]);
        expect(heap.removeTop()).toBe(500);
        expect(heap.removeTop()).toBe(1000);
        expect(heap.removeTop()).toBe(1100);
        expect(heap.removeTop()).toBe(1200);
        expect(heap.removeTop()).toBe(1300);
        expect(heap.removeTop()).toBe(1500);
        expect(heap.removeTop()).toBe(2000);
        expect(heap.removeTop()).toBe(3000);
        expect(heap.removeTop()).toBe(4000);
        expect(heap.isEmpty()).toBeTruthy();
        expect(() => heap.top()).toThrowError("Heap is empty");
        expect(() => heap.removeTop()).toThrowError("Heap is empty");
      });
    });

    describe("Max heap", () => {
      let heap: BinaryHeap<number>;

      beforeEach(() => {
        heap = new BinaryHeap<number>(BinaryHeapType.Max, predicate);
      });

      afterEach(() => {
        heap = undefined;
      });

      it("should insert elements and remove top correctly", () => {
        // Basic insertion, no bubbling
        heap.insertAll([8, 7, 5, 2, -1]);
        expect(heap.top()).toBe(8);
        expect(heap.removeTop()).toBe(8);
        expect(heap.size).toBe(4);
        expect(heap.top()).toBe(7);
        expect(heap.removeTop()).toBe(7);
        expect(heap.size).toBe(3);
        heap.clear();
        expect(heap.isEmpty()).toBeTruthy();

        // Complex insertion, lots of bubbling.
        heap.insertAll([5, 2, 9, -1, -2, 10, -10, 30, 3]);
        expect(heap.removeTop()).toBe(30);
        expect(heap.removeTop()).toBe(10);
        expect(heap.removeTop()).toBe(9);
        expect(heap.removeTop()).toBe(5);
        expect(heap.removeTop()).toBe(3);
        expect(heap.removeTop()).toBe(2);
        expect(heap.removeTop()).toBe(-1);
        expect(heap.removeTop()).toBe(-2);
        expect(heap.removeTop()).toBe(-10);
        expect(heap.isEmpty()).toBeTruthy();
        expect(() => heap.top()).toThrowError("Heap is empty");
        expect(() => heap.removeTop()).toThrowError("Heap is empty");

        // Duplicate insertion.
        heap.insert(3);
        expect(() => heap.insert(3)).toThrowError("Element already exists in heap: 3");
        expect(heap.size).toBe(1);
      });

      it("should perform heapsort", () => {
        heap.insertAll([3, -1, 2000, 40, -123, 401, -9, 1005]);

        const result = [];
        while (!heap.isEmpty()) {
          result.unshift(heap.removeTop());
        }
        expect(result).toEqual([-123, -9, -1, 3, 40, 401, 1005, 2000]);
      });
    });
  });

  describe("N-ary Tree", () => {
    describe("Trie", () => {
      let trie: TestTrie;

      beforeEach(() => {
        trie = new TestTrie();
      });

      afterEach(() => {
        trie = undefined;
      });

      it("should insert words and validate them", () => {
        trie.insert("hello");
        trie.insert("hey");
        expect(trie.validateWord("hello")).toBeTruthy();
        expect(trie.validateWord("hey")).toBeTruthy();
        expect(trie.validateWord("hell")).toBeFalsy();
        expect(trie.size).toBe(6);
        trie.clear();
        expect(trie.isEmpty()).toBeTruthy();
      });

      it("should validate prefixes", () => {
        trie.insertAll(["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog"]);
        expect(trie.validatePrefix("qui")).toBeTruthy();
        expect(trie.validatePrefix("l")).toBeTruthy();
        expect(trie.validatePrefix("dog")).toBeTruthy();
        expect(trie.validatePrefix("asdf")).toBeFalsy();
      });

      it("should not allow duplicate words", () => {
        trie.insert("hello");
        expect(trie.insert("hello")).toBeFalsy();
        expect(trie.insert("he")).toBeTruthy();
        expect(trie.validateWord("he")).toBeTruthy();
        expect(trie.validateWord("hello")).toBeTruthy();
        expect(trie.validateWord("hel")).toBeFalsy();
        expect(trie.validateWord("asdf")).toBeFalsy();
      });

      it("should not allow words with space characters", () => {
        expect(() => trie.insert("hello world")).toThrowError("Invalid word: hello world");
        expect(() => trie.insert("hello         world")).toThrow();
        expect(() => trie.insert("       helloworld     ")).toThrow();
        expect(() => trie.insert("       ")).toThrow();
        expect(() => trie.insert("hello\tworld")).toThrow();
        expect(() => trie.insert("hello\nworld")).toThrow();
        expect(trie.isEmpty()).toBeTruthy();
      });

      it("should get number of children correctly", () => {
        trie.insertAll(["a", "b", "c", "d"]);
        expect(trie.getNumberOfChildren(trie.getRootNode())).toBe(4);
      });

      it("should do traversals correctly", () => {
        trie.insertAll(["hello", "human", "hug"]);
        expect(trie.inOrder()).toEqual([]);
        expect(trie.preOrder()).toEqual(["h", "e", "l", "l", "o", "u", "m", "a", "n", "g"]);
        expect(trie.postOrder()).toEqual(["o", "l", "l", "e", "n", "a", "m", "g", "u", "h"]);
      });
    });
  });
});
