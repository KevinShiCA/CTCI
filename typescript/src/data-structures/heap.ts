import { BinaryTree, BinaryTreeNode, BinaryNodeRelationship } from "./tree";

export enum BinaryHeapType {
  Min = "min",
  Max = "max"
}

export class BinaryHeap<T> extends BinaryTree<T> {
  constructor(private heapType: BinaryHeapType, private predicate: (a: T, b: T) => 1 | 0 | -1) {
    super();
    this.heapType = heapType;
  }

  insert(elem: T) {
    const toInsert: BinaryTreeNode<T> = { value: elem, parent: undefined, left: undefined, right: undefined };
    if (!this.root) {
      this.root = toInsert;
      this._size++;
      return true;
    }
    const insertAtNode = this.getInsertNode();

    toInsert.parent = insertAtNode;
    if (this.isLeaf(insertAtNode)) {
      insertAtNode.left = toInsert;
    } else {
      insertAtNode.right = toInsert;
    }
    while (toInsert.parent && this.getPriority(toInsert.parent, toInsert) > 0) {
      this.swap(toInsert.parent, toInsert);
    }
    this._size++;
    return true;
  }

  /** Removes and returns the root of the heap. */
  removeTop() {
    if (!this.root) {
      throw new Error("Heap is empty");
    }
    const newRoot = this.getRemoveNode();
    const { value } = this.root;
    if (this.isRoot(newRoot)) {
      this.root = undefined;
      this._size = 0;
      return value;
    }
    if (this.getRelationship(newRoot.parent, newRoot) === BinaryNodeRelationship.LeftChild) {
      newRoot.parent.left = undefined;
    } else {
      newRoot.parent.right = undefined;
    }
    newRoot.parent = undefined;
    newRoot.left = this.root.left;
    newRoot.right = this.root.right;

    const currentNode = newRoot;
    let didSwap = false;
    while (!this.isLeaf(currentNode)) {
      // Because of the insertion strategy,
      // it is impossible for the left child to not exist if currentNode is not a leaf.
      const leftPriority = this.getPriority(currentNode.left, currentNode);
      const rightPriority = currentNode.right ? this.getPriority(currentNode.right, currentNode) : undefined;

      if (rightPriority === undefined) { // There is only a left child (left child).
        if (leftPriority < 0) {
          this.swap(currentNode, currentNode.left);
          didSwap = true;
        } else {
          break;
        }
      } else { // Both children exist.
        if (this.getPriority(currentNode, currentNode.left) < 0 && this.getPriority(currentNode, currentNode.right) < 0) {
          // Node is in the correct position.
          break;
        }
        // Otherwise, keep bubbling.
        const leftRightPriority = this.getPriority(currentNode.left, currentNode.right);
        if (leftRightPriority < 0) { // Left is smaller, so bubble left.
          this.swap(currentNode, currentNode.left);
        } else {
          this.swap(currentNode, currentNode.right);
        }
        didSwap = true;
      }
    }
    // New root was immediately placed in the right position, swap pointers manually.
    // This can only occur when deleting from a heap of size 3 (resulting in size 2).
    if (!didSwap) {
      this.root = newRoot;
      this.root.parent = undefined;
      // No need to check the right child, since it cannot exist in a heap of size 2.
      if (this.root.left) {
        this.root.left.parent = this.root;
      }
    }
    this._size--;
    return value;
  }

  /** Returns the root of the heap. */
  top() {
    if (!this.root) {
      throw new Error("Heap is empty");
    }
    return this.root.value;
  }

  /** Returns the node where the insert should happen. */
  private getInsertNode() {
    return this.getInsertNodeHelper(this.root);
  }

  private getInsertNodeHelper(node: BinaryTreeNode<T>): BinaryTreeNode<T> {
    if (!node.left || !node.right) {
      return node;
    }
    if (this.subtreeSize(node.left) <= this.subtreeSize(node.right)) {
      return this.getInsertNodeHelper(node.left);
    }
    return this.getInsertNodeHelper(node.right);
  }

  /** Returns the node that should replace the root following a call to removeTop(). */
  private getRemoveNode() {
    // If this method is called, then the root exists.
    return this.getRemoveNodeHelper(this.root);
  }

  private getRemoveNodeHelper(node: BinaryTreeNode<T>): BinaryTreeNode<T> {
    if (this.isLeaf(node)) {
      return node;
    }
    if (this.subtreeSize(node.left) <= this.subtreeSize(node.right)) {
      return this.getRemoveNodeHelper(node.right);
    }
    return this.getRemoveNodeHelper(node.left);
  }

  /** Swap a child with its parent. */
  private swap(parent: BinaryTreeNode<T>, child: BinaryTreeNode<T>) {
    const top = parent.parent;
    const sibling = this.getRelationship(parent, child) === BinaryNodeRelationship.LeftChild ?
      parent.right : parent.left;
    const bottomLeft = child.left;
    const bottomRight = child.right;

    child.parent = top;
    if (this.getRelationship(parent, child) === BinaryNodeRelationship.LeftChild) {
      child.left = parent;
    } else {
      child.right = parent;
    }
    if (top) {
      if (this.getRelationship(top, parent) === BinaryNodeRelationship.LeftChild) {
        top.left = child;
      } else {
        top.right = child;
      }
    }
    if (!sibling) {
      // If the sibling node doesn't exist, then the child must be a left child.
      child.right = undefined;
    } else {
      if (this.getRelationship(parent, sibling) === BinaryNodeRelationship.LeftChild) {
        child.left = sibling;
      } else {
        child.right = sibling;
      }
      sibling.parent = child;
    }
    parent.left = bottomLeft;
    if (bottomLeft) {
      bottomLeft.parent = parent;
    }
    parent.right = bottomRight;
    if (bottomRight) {
      bottomRight.parent = parent;
    }

    parent.parent = child;

    if (this.isRoot(child)) {
      this.root = child;
    }
  }

  /** Lowest priority at the top. */
  private getPriority(a: BinaryTreeNode<T>, b: BinaryTreeNode<T>) {
    if (this.predicate(a.value, b.value) === 0) {
      throw new Error(`Element already exists in heap: ${a.value}`);
    }
    if (this.heapType === BinaryHeapType.Min) {
      return this.predicate(a.value, b.value);
    }
    return -this.predicate(a.value, b.value);
  }
}
