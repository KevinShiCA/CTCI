/**
 * Not using the actual LinkedList implementation since it makes most of these questions trivial.
 * Instead, use the internal implementation node.
 * For all questions that need a singly linked list, the prev pointer is simply ignored.
 */
import { LinkedListNode } from "linked-list";
import { LinkedStack } from "stack";

/**
 * 2.1 Remove Dups: Write a function to remove duplicates from an unsorted linked list.
 * What if an extra buffer was not allowed (i.e. O(1) space is needed)?
 * Assume that the list contains numbers.
 */

/** Time: O(n). Space: O(n). */
export function deleteDuplicatesBuffer(head: LinkedListNode<number>) {
  const visited: Record<number, boolean> = {};
  let previous: LinkedListNode<number>;
  let currentNode = head;
  while (currentNode) {
    if (visited[currentNode.value]) {
      previous.next = currentNode.next;
    } else {
      visited[currentNode.value] = true;
      previous = currentNode;
    }
    currentNode = currentNode.next;
  }
}

/** Time: O(n^2). Space: O(1). */
export function deleteDuplicatesNoBuffer(head: LinkedListNode<number>) {
  let currentNode = head;
  while (currentNode) {
    let runner = currentNode;
    while (runner.next) {
      if (runner.next.value === currentNode.value) {
        runner.next = runner.next.next;
      } else {
        runner = runner.next;
      }
    }
    currentNode = currentNode.next;
  }
}

/**
 * 2.2 Return Nth to Last: Write a function to find the nth to last element of a singly linked list.
 * Assume that the size of the list is not available, since this makes the solution trivial.
 */

/** Time: O(n). Space: O(n) heap space. */
export function nthToLastRecursive(head: LinkedListNode<number>, n: number) {
  return nthToLastHelper(head, n, { value: 0 });
}

function nthToLastHelper(node: LinkedListNode<number>, n: number, tracer: { value: number }): number {
  if (!node) {
    return undefined;
  }
  const nd = nthToLastHelper(node.next, n, tracer);
  tracer.value++;
  if (tracer.value === n) {
    return node.value;
  }
  return nd;
}

/** Time: O(n). Size: O(1). */
export function nthToLastIterative(head: LinkedListNode<number>, n: number) {
  let currentNode = head;
  let scout = head;

  for (let i = 0; i < n; i++) {
    if (!scout) {
      return undefined;
    }
    scout = scout.next;
  }

  while (scout) {
    scout = scout.next;
    currentNode = currentNode.next;
  }
  return currentNode.value;
}

/**
 * 2.3 Delete Middle Node: Write a function to delete an arbitrary middle node of a
 * singly linked list, given only access to that node.
 * Assume that the given node cannot be the first or the last node.
 */

/** Time: O(1). Space: O(1). */
export function deleteMiddleNode(node: LinkedListNode<number>) {
  if (!node || !node.next) {
    throw new Error("Can only delete middle nodes");
  }
  const next = node.next;
  node.value = next.value;
  node.next = next.next;
}

/**
 * 2.4 Partition: Write a function to partition a linked list around a value x,
 * such that all nodes less than x come before all nodes great than or equal to x.
 * The relative order of the elements should be preserved.
 * The head of the partitioned list should be returned by the function.
 */

/** Time: O(n). Space: O(n). */
export function partitionList(head: LinkedListNode<number>, x: number) {
  // Three linkedlists to hold smaller, larger, and equal values.
  let smallerHead: LinkedListNode<number>, smallerTail: LinkedListNode<number>;
  let greaterHead: LinkedListNode<number>, greaterTail: LinkedListNode<number>;
  let equalHead: LinkedListNode<number>, equalTail: LinkedListNode<number>;
  let currentNode = head;

  // Add all elements to their appropriate list.
  while (currentNode) {
    if (currentNode.value === x) {
      if (!equalHead) {
        equalHead = currentNode;
        equalTail = currentNode;
      } else {
        equalTail.next = currentNode;
        equalTail = currentNode;
      }
    } else if (currentNode.value < x) {
      if (!smallerHead) {
        smallerHead = currentNode;
        smallerTail = currentNode;
      } else {
        smallerTail.next = currentNode;
        smallerTail = currentNode;
      }
    } else {
      if (!greaterTail) {
        greaterHead = currentNode;
        greaterTail = currentNode;
      } else {
        greaterTail.next = currentNode;
        greaterTail = currentNode;
      }
    }
    currentNode = currentNode.next;
  }
  if (greaterTail) {
    greaterTail.next = undefined;
  }
  // Return the concatenation of the 3 lists.
  if (!smallerHead) {
    if (!equalHead) {
      return greaterHead;
    }
    equalTail.next = greaterHead;
    return equalHead;
  }
  if (!equalHead) {
    smallerTail.next = greaterHead;
    return smallerHead;
  }
  smallerTail.next = equalHead;
  equalTail.next = greaterHead;
  return smallerHead;
}

/**
 * 2.5 Sum Lists: Given two integers represented by linked lists, where each node contains a
 * single digit, write a function that adds the two numbers into a new linked list and returns the head.
 * The linked lists store numbers in reverse order.
 */

/** Time: O(n), where n is the length of the longer number. Space: O(n) heap space. */
export function sumListsReverse(head1: LinkedListNode<number>, head2: LinkedListNode<number>) {
  return sumListsReverseHelper(head1, head2, 0);
}

function sumListsReverseHelper(node1: LinkedListNode<number>, node2: LinkedListNode<number>, carry: number) {
  if (!node1 && !node2 && carry === 0) {
    return undefined;
  }
  let value = carry;
   // Add the carry to the sum.
  if (node1) {
    value += node1.value;
  }
  if (node2) {
    value += node2.value;
  }
  // Take the ones digit of the sum.
  const result = new LinkedListNode<number>(value % 10, undefined, undefined);
  if (node1 || node2) {
    const temp = sumListsReverseHelper(
      node1 ? node1.next : undefined,
      node2 ? node2.next : undefined,
      value >= 10 ? 1 : 0
    );
    result.next = temp;
  }
  return result;
}

/**
 * 2.6 Palindrome List: Implement a function to check if a linked list a palindrome.
 */

/** Time: O(n). Space: O(n). */
export function isListPalindrome(head: LinkedListNode<string>) {
  let currentNode = head;
  let runner = head;
  const stack = new LinkedStack<string>();
  while (runner && runner.next) {
    stack.push(currentNode.value);
    currentNode = currentNode.next;
    runner = runner.next.next;
  }
  if (runner) { // List has an odd number of nodes, skip the middle ones.
    currentNode = currentNode.next;
  }
  while (currentNode) {
    if (stack.pop() !== currentNode.value) {
      return false;
    }
    currentNode = currentNode.next;
  }
  return true;
}

/**
 * 2.7 List Intersection: Given two singly linked lists of size M and N, write a function to determine
 * if the two lists intersect, and if they do, return the intersecting node.
 */

/** Time: O(M + N). Space: O(1). */
export function listIntersect(head1: LinkedListNode<number>, head2: LinkedListNode<number>) {
  if (!head1 || !head2) {
    return undefined;
  }
  const getTailAndSize = (node: LinkedListNode<number>) => {
    let currentNode = node;
    let size = 0;
    while (currentNode.next) {
      currentNode = currentNode.next;
      size++;
    }
    return { tail: currentNode, size: size + 1 };
  };
  const tailSize1 = getTailAndSize(head1);
  const tailSize2 = getTailAndSize(head2);
  if (tailSize1.tail !== tailSize2.tail) {
    return undefined;
  }
  let shorter = tailSize1.size < tailSize2.size ? head1 : head2;
  let longer = tailSize1.size < tailSize2.size ? head2 : head1;
  for (let i = 0; i < Math.abs(tailSize1.size - tailSize2.size); i++) {
    longer = longer.next;
  }
  while (shorter !== longer) {
    shorter = shorter.next;
    longer = longer.next;
  }
  return shorter;
}

/**
 * 2.8 Loop Detection: Given a singly linked list, write a function to determine if the
 * list is circular. If it is, return the node at the beginning of the loop.
 */

/** Time: O(kn), where k is the size of the loop. Space: O(1). */
export function detectLoop(head: LinkedListNode<number>) {
  let runner = head;
  let currentNode = head;

  while (runner && runner.next) {
    currentNode = currentNode.next;
    runner = runner.next.next;
    if (runner === currentNode) {
      break;
    }
  }

  if (!runner || !runner.next) {
    return undefined;
  }

  currentNode = head;
  while (currentNode !== runner) {
    currentNode = currentNode.next;
    runner = runner.next;
  }
  return runner;
}
