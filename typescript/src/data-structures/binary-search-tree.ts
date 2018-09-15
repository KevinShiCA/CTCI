import { BinaryTree, BinaryTreeNode, BinaryNodeRelationship } from "./tree";

export class BinarySearchTree<T> extends BinaryTree<T> {
  constructor(protected predicate: (a: T, b: T) => 1 | 0 | -1) {
    super();
    this.predicate = predicate;
  }

  /**
   * Insert a new value into the tree.
   */
  insert(elem: T) {
    const toInsert: BinaryTreeNode<T> = { value: elem, parent: undefined, left: undefined, right: undefined };
    if (!this.root) {
      this.root = toInsert;
      this._size++;
      return true;
    }

    let currentNode = this.root;
    while (!this.isLeaf(currentNode)) {
      if (this.predicate(elem, currentNode.value) === 0) {
        return false;
      }
      if (this.predicate(elem, currentNode.value) < 0) {
        if (!currentNode.left) {
          break;
        }
        currentNode = currentNode.left;
      } else {
        if (!currentNode.right) {
          break;
        }
        currentNode = currentNode.right;
      }
    }
    if (this.predicate(elem, currentNode.value) === 0) {
      return false;
    }
    toInsert.parent = currentNode;
    if (this.predicate(elem, currentNode.value) < 0) {
      currentNode.left = toInsert;
    } else {
      currentNode.right = toInsert;
    }
    this._size++;
    return true;
  }

  /**
   * Delete a node from the tree.
   */
  delete(elem: T) {
    let currentNode = this.root;
    while (currentNode && this.predicate(elem, currentNode.value) !== 0) {
      if (this.predicate(elem, currentNode.value) < 0) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    // Element does not exist.
    if (!currentNode) {
      return false;
    }

    let rootReplacement: BinaryTreeNode<T> = undefined; // Used only if deleting the root.
    if (this.isLeaf(currentNode)) {
      if (!this.isRoot(currentNode)) {
        if (this.getRelationship(currentNode.parent, currentNode) === BinaryNodeRelationship.LeftChild) {
          currentNode.parent.left = undefined;
        } else {
          currentNode.parent.right = undefined;
        }
      }
    } else if (this.numberOfChildren(currentNode) === 1) { // Element has one child.
      // Replace with the left or right child, whichever exists.
      const replacement = currentNode.left ? currentNode.left : currentNode.right;
      replacement.parent = currentNode.parent;
      if (this.isRoot(currentNode)) {
        rootReplacement = currentNode.left ? currentNode.left : currentNode.right;
        rootReplacement.parent = undefined;
      } else if (this.getRelationship(currentNode.parent, currentNode) === BinaryNodeRelationship.LeftChild) {
        currentNode.parent.left = replacement;
      } else {
        currentNode.parent.right = replacement;
      }
    } else {
      // Element has two children.
      // Find the minimum in the right subtree, replace the node with it.
      const minInRightSubtree = this.getMinInSubtree(currentNode.right);
      // The replacement node is either a leaf or has a right child.
      if (this.getRelationship(minInRightSubtree.parent, minInRightSubtree) === BinaryNodeRelationship.LeftChild) {
        minInRightSubtree.parent.left = minInRightSubtree.right;
      } else {
        minInRightSubtree.parent.right = minInRightSubtree.right;
      }

      minInRightSubtree.parent = currentNode.parent;
      minInRightSubtree.left = currentNode.left;
      minInRightSubtree.right = currentNode.right;
      if (minInRightSubtree.left) {
        minInRightSubtree.left.parent = minInRightSubtree;
      }
      if (minInRightSubtree.right) {
        minInRightSubtree.right.parent = minInRightSubtree;
      }

      if (this.isRoot(currentNode)) {
        minInRightSubtree.parent = undefined;
        rootReplacement = minInRightSubtree;
      } else if (this.getRelationship(currentNode.parent, currentNode) === BinaryNodeRelationship.LeftChild) {
        minInRightSubtree.parent.left = minInRightSubtree;
      } else {
        minInRightSubtree.parent.right = minInRightSubtree;
      }
    }
    if (this.predicate(elem, this.root.value) === 0) {
      this.root = rootReplacement;
    }
    this._size--;
    return true;
  }

  search(elem: T) {
    if (!this.root) {
      return false;
    }
    return this.searchHelper(elem, this.root);
  }

  private searchHelper(elem: T, node: BinaryTreeNode<T>) {
    if (!node) {
      return false;
    }
    if (this.predicate(elem, node.value) === 0) {
      return true;
    }
    if (this.predicate(elem, node.value) < 0) {
      return this.searchHelper(elem, node.left);
    }
    return this.searchHelper(elem, node.right);
  }

  /**
   * Get the depth of a node in the tree.
   */
  depth(elem: T) {
    let d = 0;
    let currentNode = this.root;
    while (currentNode) {
      if (this.predicate(elem, currentNode.value) === 0) {
        return d;
      }
      if (this.predicate(elem, currentNode.value) < 0) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
      d++;
    }
    return -1;
  }

  /**
   * Gets the minimum node in the subtree rooted at a given node.
   */
  private getMinInSubtree(node: BinaryTreeNode<T>) {
    let currentNode = node;
    while (currentNode.left) {
      currentNode = currentNode.left;
    }
    return currentNode;
  }
}
