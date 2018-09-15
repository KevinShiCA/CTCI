interface TreeNode<T> {
  value: T;
  parent: TreeNode<T>;
}

export interface BinaryTreeNode<T> extends TreeNode<T> {
  parent: BinaryTreeNode<T>;
  left: BinaryTreeNode<T>;
  right: BinaryTreeNode<T>;
}

export interface NaryTreeNode<T> extends TreeNode<T> {
  parent: NaryTreeNode<T>;
  children: (NaryTreeNode<T> | DummyEndNode)[];
}

export type DummyEndNode = {
  nodeType: "dummy"
};

export const isDummy = (x: any): x is DummyEndNode => x.nodeType && x.nodeType === "dummy";

abstract class Tree<T> {
  protected _size: number;

  constructor() {
    this._size = 0;
  }

  abstract insert(elem: T): boolean;

  abstract clear(): void;

  abstract inOrder(): T[];

  abstract preOrder(): T[];

  abstract postOrder(): T[];

  protected abstract numberOfChildren(node: TreeNode<T>): number;

  insertAll(elems: T[]) {
    let result = true;
    elems.forEach(elem => {
      const success = this.insert(elem);
      result = result && success;
    });
    return result;
  }

  isEmpty() {
    return this.size === 0;
  }

  protected isRoot(node: TreeNode<T>) {
    return !node.parent;
  }

  protected isLeaf(node: TreeNode<T>) {
    return this.numberOfChildren(node) === 0;
  }

  get size() {
    return this._size;
  }
}

export enum BinaryNodeRelationship {
  LeftChild = "left",
  RightChild = "right",
  Parent = "parent",
  None = "none"
}

export abstract class BinaryTree<T> extends Tree<T> {
  protected root: BinaryTreeNode<T>;

  constructor() {
    super();
    this.root = undefined;
  }

  clear() {
    this.root = undefined;
    this._size = 0;
  }

  protected numberOfChildren(node: BinaryTreeNode<T>) {
    return +!!node.left + +!!node.right;
  }

  protected subtreeSize(node: BinaryTreeNode<T>) {
    if (!node) {
      return 0;
    }
    return 1 + this.subtreeSize(node.left) + this.subtreeSize(node.right);
  }

  /**
   * Completes the sentence: b is a's _______.
   */
  protected getRelationship(a: BinaryTreeNode<T>, b: BinaryTreeNode<T>) {
    if (a.left && a.left.value === b.value) {
      return BinaryNodeRelationship.LeftChild;
    }
    if (a.right && a.right.value === b.value) {
      return BinaryNodeRelationship.RightChild;
    }
    if (a.parent && a.parent.value === b.value) {
      return BinaryNodeRelationship.Parent;
    }
    return BinaryNodeRelationship.None;
  }

  inOrder() {
    const result: T[] = [];
    this.inOrderHelper(this.root, result);
    return result;
  }

  private inOrderHelper(node: BinaryTreeNode<T>, result: T[]) {
    if (!node) {
      return;
    }
    this.inOrderHelper(node.left, result);
    result.push(node.value);
    this.inOrderHelper(node.right, result);
  }

  preOrder() {
    const result: T[] = [];
    this.preOrderHelper(this.root, result);
    return result;
  }

  private preOrderHelper(node: BinaryTreeNode<T>, result: T[]) {
    if (!node) {
      return;
    }
    result.push(node.value);
    this.preOrderHelper(node.left, result);
    this.preOrderHelper(node.right, result);
  }

  postOrder() {
    const result: T[] = [];
    this.postOrderHelper(this.root, result);
    return result;
  }

  private postOrderHelper(node: BinaryTreeNode<T>, result: T[]) {
    if (!node) {
      return;
    }
    this.postOrderHelper(node.left, result);
    this.postOrderHelper(node.right, result);
    result.push(node.value);
  }
}

export abstract class NaryTree<T> extends Tree<T> {
  protected root: NaryTreeNode<T>;

  constructor() {
    super();
    this.root = undefined;
  }

  clear() {
    this.root = undefined;
    this._size = 0;
  }

  protected numberOfChildren(node: NaryTreeNode<T>) {
    return node.children.length;
  }

  /**
   * In order traversal is not defined for n-ary trees.
   */
  inOrder() {
    return [];
  }

  preOrder() {
    const result = [];
    this.preOrderHelper(this.root, result);
    return result;
  }

  private preOrderHelper(node: NaryTreeNode<T>, result: T[]) {
    // Base case not needed since nodes will never have undefined children.
    result.push(node.value);
    node.children.forEach(child => !isDummy(child) && this.preOrderHelper(child, result));
  }

  postOrder() {
    const result = [];
    this.postOrderHelper(this.root, result);
    return result;
  }

  private postOrderHelper(node: NaryTreeNode<T>, result: T[]) {
    node.children.forEach(child => !isDummy(child) && this.postOrderHelper(child, result));
    result.push(node.value);
  }
}
