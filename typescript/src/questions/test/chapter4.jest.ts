import { DirectedAdjacencyMatrix } from "graph-directed";
import { resetToGraphA, Foo } from "test/graph.jest";
import { BinarySearchTree } from "binary-search-tree";
import { BinaryTreeNode } from "tree";
import {
  BinaryTreeA,
  BinaryTreeB,
  BinaryTreeC,
  BinarySearchTreeA,
  BinarySearchTreeC,
  BinarySearchTreeD,
  BinarySearchTreeE
} from "tree.resources";
import {
  routeBetween,
  createMinimalBST,
  createDepthLinkedList,
  isTreeBalanced,
  validateBST,
  inOrderSuccessor,
  allSequences
} from "../chapter4";

const predicate = (a: number, b: number) => {
  if (a - b < 0) {
    return -1;
  }
  if (a - b > 0) {
    return 1;
  }
  return 0;
};

export class TestBinarySearchTree extends BinarySearchTree<number> {
  constructor(root?: BinaryTreeNode<number>) {
    super(predicate);
    this.root = root;
  }

  getRoot() {
    return this.root;
  }

  height() {
    return this.heightHelper(this.root);
  }

  getNthInOrderNode(n: number) {
    const result: BinaryTreeNode<number>[] = [];
    this.getNthInOrderNodeHelper(this.root, result);
    return result[n];
  }

  private getNthInOrderNodeHelper(node: BinaryTreeNode<number>, result: BinaryTreeNode<number>[]) {
    if (!node) {
      return;
    }
    this.getNthInOrderNodeHelper(node.left, result);
    result.push(node);
    this.getNthInOrderNodeHelper(node.right, result);
  }

  private heightHelper(node: BinaryTreeNode<number>) {
    if (!node) {
      return 0;
    }
    return Math.max(this.heightHelper(node.left) + 1, this.heightHelper(node.right) + 1);
  }
}

describe("Chapter 4", () => {
  it("should find a path between two nodes in a directed graph if it exists", () => {
    const graph = new DirectedAdjacencyMatrix<Foo>();
    resetToGraphA(graph);
    expect(routeBetween(graph, "a", "f")).toBeTruthy();
    graph.addVertex(new Foo("q"));
    expect(routeBetween(graph, "a", "q")).toBeFalsy();
  });

  it("should create a minimal height BST given a sorted array", () => {
    const arr = [1, 3, 4, 5, 9, 10, 12, 14];
    const root = createMinimalBST(arr);
    const bst = new TestBinarySearchTree(root);
    expect(bst.inOrder()).toEqual(arr);
    expect(bst.height()).toBe(4);
  });

  it("should create a list of linked lists with all nodes at each depth", () => {
    const l = createDepthLinkedList(BinaryTreeA);
    expect(l.length).toBe(4);
    expect(l[0].mapToArray(item => item.value)).toEqual([50]);
    expect(l[1].mapToArray(item => item.value)).toEqual([25, 80]);
    expect(l[2].mapToArray(item => item.value)).toEqual([30, 60, 90]);
    expect(l[3].mapToArray(item => item.value)).toEqual([85]);
  });

  it("should check if a tree is balanced", () => {
    expect(isTreeBalanced(BinaryTreeA)).toBeTruthy();
    expect(isTreeBalanced(BinaryTreeB)).toBeFalsy();
    expect(isTreeBalanced(BinaryTreeC)).toBeFalsy();
  });

  it("should check if a binary tree is a BST", () => {
    expect(validateBST(BinaryTreeA)).toBeTruthy();
    expect(validateBST(BinaryTreeB)).toBeTruthy();
    expect(validateBST(BinaryTreeC)).toBeFalsy();
  });

  it("should get the in order successor", () => {
    const bst = new TestBinarySearchTree();
    bst.insertAll(BinarySearchTreeA);
    let traversal = bst.inOrder();
    let node = bst.getNthInOrderNode(3);
    expect(inOrderSuccessor(node).value).toBe(traversal[4]);

    bst.clear();
    bst.insertAll(BinarySearchTreeC);
    traversal = bst.inOrder();
    node = bst.getNthInOrderNode(5);
    expect(inOrderSuccessor(node).value).toBe(traversal[6]);

    bst.clear();
    bst.insertAll(BinarySearchTreeD);
    traversal = bst.inOrder();
    node = bst.getNthInOrderNode(1);
    expect(inOrderSuccessor(node).value).toBe(traversal[2]);

    bst.clear();
    bst.insertAll(BinarySearchTreeE);
    traversal = bst.inOrder();
    node = bst.getNthInOrderNode(0);
    expect(inOrderSuccessor(node).value).toBe(traversal[1]);
  });

  it("should get all binary search tree insertion sequences", () => {
    const bst = new TestBinarySearchTree();
    bst.insertAll(BinarySearchTreeA);
    let result = allSequences(bst.getRoot());
    expect(result.length).toBe(45);

    bst.clear();
    bst.insertAll([2, 1, 3]);
    result = allSequences(bst.getRoot());
    expect(result.map(ll => ll.toArray())).toEqual([[2, 1, 3], [2, 3, 1]]);
  });
});
