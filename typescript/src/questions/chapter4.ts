import { DirectedAdjacencyMatrix } from "graph-directed";
import { Foo } from "test/graph.jest";
import { BinaryTreeNode } from "tree";
import { LinkedList } from "linked-list";

/**
 * 4.1 Route Between Nodes: Given a directed graph, design an algorithm to find out whether
 * there is a route between two nodes.
 */

/** Time: O(n^2). Space: O(n). */
export function routeBetween(graph: DirectedAdjacencyMatrix<Foo>, start: string, end: string) {
  // AdjacencyMatrix DFS is O(n^2).
  const dfs = graph.dfs(start);
  for (const item of dfs) {
    if (item.value === end) {
      return true;
    }
  }
  return false;
}

/**
 * 4.2 Minimal Tree: Given a sorted array with unique integer elements, write a function to
 * create a binary search tree with minimal height.
 */

/** Time: O(nlogn). Space: O(nlogn) heap space. */
export function createMinimalBST(arr: number[]) {
  return createMinimalBSTHelper(arr, 0, arr.length - 1);
}

function createMinimalBSTHelper(arr: number[], start: number, end: number) {
  if (end < start) {
    return undefined;
  }
  const mid = Math.floor((start + end) / 2);
  const node: BinaryTreeNode<number> = {
    value: arr[mid],
    parent: undefined,
    left: undefined,
    right: undefined
  };
  node.left = createMinimalBSTHelper(arr, start, mid - 1);
  node.right = createMinimalBSTHelper(arr, mid + 1, end);
  return node;
}

/**
 * 4.3 List of Depths: Given a binary tree, write an algorithm that creates a list of linked lists
 * of all nodes at each depth. If you have a tree with depth D, you will get D linked lists.
 */

/** Time: O(n). Space: O(logn) heap space. */
export function createDepthLinkedList(root: BinaryTreeNode<number>) {
  const list: LinkedList<BinaryTreeNode<number>>[] = [];
  createDepthLinkedListHelper(root, list, 0);
  return list;
}

function createDepthLinkedListHelper(node: BinaryTreeNode<number>, list: LinkedList<BinaryTreeNode<number>>[], depth: number) {
  if (!node) {
    return;
  }
  let ll: LinkedList<BinaryTreeNode<number>>;
  if (list.length === depth) {
    ll = new LinkedList();
    list.push(ll);
  } else {
    ll = list[depth];
  }
  ll.append(node);
  createDepthLinkedListHelper(node.left, list, depth + 1);
  createDepthLinkedListHelper(node.right, list, depth + 1);
}

/**
 * 4.4 Check Balanced: Implement a function to check if a binary tree is balanced. A tree is
 * balanced if the heights of two subtrees never differ by more than 1.
 */

/** Time: O(N). Space: O(k), where k is the height of the tree. */
export function isTreeBalanced(root: BinaryTreeNode<number>) {
  return getHeight(root) !== Number.MIN_VALUE;
}

// Uses Number.MIN_VALUE as an error code.
function getHeight(node: BinaryTreeNode<number>) {
  if (!node) {
    return -1;
  }
  const leftHeight = getHeight(node.left);
  if (leftHeight === Number.MIN_VALUE) {
    return Number.MIN_VALUE;
  }
  const rightHeight = getHeight(node.right);
  if (rightHeight === Number.MIN_VALUE) {
    return Number.MIN_VALUE;
  }
  if (Math.abs(leftHeight - rightHeight) > 1) {
    return Number.MIN_VALUE;
  }
  return Math.max(leftHeight, rightHeight) + 1;
}

/**
 * 4.5 Validate BST: Implement a function to check if a binary tree is a BST.
 */

/** Time: O(n). Space: O(logn) heap space. */
export function validateBST(root: BinaryTreeNode<number>) {
  return validateBSTHelper(root, undefined, undefined);
}

function validateBSTHelper(node: BinaryTreeNode<number>, min: number, max: number) {
  if (!node) {
    return true;
  }
  if ((min !== undefined && node.value <= min) || (max !== undefined && node.value > max)) {
    return false;
  }
  return !(!validateBSTHelper(node.left, min, node.value) || !validateBSTHelper(node.right, node.value, max));
}

/**
 * 4.6 Successor: Implement a function to get the in order successor of a node in a BST.
 * Assume that a link to the parent node exists.
 */

/** Time: O(logn). Space: O(1). */
export function inOrderSuccessor(node: BinaryTreeNode<number>) {
  if (!node) {
    return undefined;
  }
  if (node.right) {
    let currentNode = node.right;
    while (currentNode.left) {
      currentNode = currentNode.left;
    }
    return currentNode;
  }
  let runner = node;
  let currentNode = runner.parent;
  while (currentNode && currentNode.left && currentNode.left.value !== runner.value) {
    runner = currentNode;
    currentNode = currentNode.parent;
  }
  return currentNode;
}

/**
 * 4.9 BST Sequences: Write a function that gets all possible arrays that could have led to
 * a given binary search tree state.
 */

/** Time: O(n!). Space: O(n). */
export function allSequences(node: BinaryTreeNode<number>) {
  const result: LinkedList<number>[] = [];
  if (!node) {
    return [new LinkedList<number>()];
  }
  const prefix = new LinkedList<number>();
  prefix.append(node.value);

  const leftSequence = allSequences(node.left);
  const rightSequence = allSequences(node.right);

  leftSequence.forEach(left => {
    rightSequence.forEach(right => {
      const weaved: LinkedList<number>[] = [];
      weaveLists(left, right, weaved, prefix);
      result.push(...weaved);
    });
  });
  return result;
}

function weaveLists(first: LinkedList<number>, second: LinkedList<number>, results: LinkedList<number>[], prefix: LinkedList<number>) {
  if (first.size === 0 || second.size === 0) {
    const result = new LinkedList<number>();
    result.appendAll(prefix.toArray());
    result.appendAll(first.toArray());
    result.appendAll(second.toArray());
    results.push(result);
    return;
  }

  const headFirst = first.removeAt(0);
  prefix.append(headFirst);
  weaveLists(first, second, results, prefix);
  prefix.removeAt(prefix.size - 1);
  first.add(headFirst, 0);

  const headSecond = second.removeAt(0);
  prefix.append(headSecond);
  weaveLists(first, second, results, prefix);
  prefix.removeAt(prefix.size - 1);
  second.add(headSecond, 0);
}

/**
 * 4.10 Check Subtree: Write an algorithm to determine if one tree is a subtree of another.
 */
export function containsSubtree(root1: BinaryTreeNode<number>, root2: BinaryTreeNode<number>) {
  const traversal1 = { value: "" };
  getPreorder(root1, traversal1);
  const traversal2 = { value: "" };
  getPreorder(root1, traversal2);

  return traversal1.value.includes(traversal2.value);
}

function getPreorder(node: BinaryTreeNode<number>, result: { value: string; }) {
  if (!node) {
    result.value += "X";
  }
  result.value += node.value;
  getPreorder(node.left, result);
  getPreorder(node.right, result);
}

export function get2018(arr: number[]) {
  arr.sort();
  let i = 0;
  let j = 1;
  while (i < arr.length && j < arr.length) {
    if (arr[j] - arr[i] === 2018 && i !== j) {
      return { i, j };
    }
    if (arr[j] - arr[i] < 2018) {
      j++;
    } else {
      i++;
    }
  }
  return undefined;
}
