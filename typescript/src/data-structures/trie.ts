import { NaryTree, NaryTreeNode, isDummy } from "./tree";

export class Trie extends NaryTree<string> {
  constructor() {
    super();
    this.root = {
      value: "",
      parent: undefined,
      children: []
    };
  }

  insert(word: string) {
    if (/\s/.test(word)) {
      throw new Error(`Invalid word: ${word}`);
    }
    const letterArray = [...word];
    let currentNode = this.root;
    let didInsert = false;
    letterArray.forEach(letter => {
      const letterPosition = currentNode.children.findIndex(child => !isDummy(child) && child.value === letter);

      if (letterPosition > -1) {
        currentNode = currentNode.children[letterPosition] as NaryTreeNode<string>;
      } else {
        currentNode.children.push({ value: letter, parent: currentNode, children: [] });
        currentNode = currentNode.children[currentNode.children.length - 1] as NaryTreeNode<string>;
        this._size++;
        didInsert = true;
      }
    });
    if (didInsert || !currentNode.children.find(node => isDummy(node))) {
      currentNode.children.push({ nodeType: "dummy" });
      return true;
    }
    return false;
  }

  /** Checks if a prefix exists in the trie. */
  validatePrefix(prefix: string) {
    const letterArray = [...prefix];
    let currentNode = this.root;
    for (const letter of letterArray) {
      const letterPosition = currentNode.children.findIndex(child => !isDummy(child) && child.value === letter);
      if (letterPosition === -1) {
        return false;
      }
      currentNode = currentNode.children[letterPosition] as NaryTreeNode<string>;
    }
    return true;
  }

  /** Checks if a word exists in the trie. */
  validateWord(word: string) {
    const letterArray = [...word];
    let currentNode = this.root;
    for (const letter of letterArray) {
      const letterPosition = currentNode.children.findIndex(child => !isDummy(child) && child.value === letter);
      if (letterPosition === -1) {
        return false;
      }
      currentNode = currentNode.children[letterPosition] as NaryTreeNode<string>;
    }
    return !!currentNode.children.find(node => isDummy(node));
  }

  preOrder() {
    // Remove the first node in the traversal since the root is empty.
    return super.preOrder().slice(1);
  }

  postOrder() {
    // Remove the last node in the traversal since the root is empty.
    return super.postOrder().slice(0, this.size);
  }
}
