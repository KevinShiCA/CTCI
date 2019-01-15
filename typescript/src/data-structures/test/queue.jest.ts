import { ArrayQueue, LinkedQueue, Queue } from "../queue";
import { ArrayPriorityQueue, LinkedPriorityQueue } from "../priority-queue";

class TestArrayQueue<T> extends ArrayQueue<T> {
  toArray() {
    return this.elems;
  }
}

class TestLinkedQueue<T> extends LinkedQueue<T> {
  toArray() {
    const result: T[] = [];
    let currentNode = this.head;
    while (currentNode.next) {
      result.push(currentNode.value);
      currentNode = currentNode.next;
    }
    result.push(currentNode.value);
    return result;
  }
}

describe("Queue", () => {
  const testQueue = (queue: Queue<number>, queueType: string) => {
    describe(queueType, () => {
      it("should enqueue and dequeue items properly", () => {
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.size()).toBe(3);
        expect(queue.peek()).toBe(1);

        expect(queue.dequeue()).toBe(1);
        expect(queue.toArray()).toEqual([2, 3]);

        queue.enqueue(4);
        queue.enqueue(5);
        queue.enqueue(6);

        expect(queue.toArray()).toEqual([2, 3, 4, 5, 6]);

        queue.clear();
        expect(queue.isEmpty()).toBeTruthy();
        expect(() => queue.peek()).toThrowError("Queue is empty");
        expect(() => queue.dequeue()).toThrowError("Queue is empty");
      });
    });
  };
  let queue: Queue<number> = new TestArrayQueue<number>();
  testQueue(queue, "Array queue");
  queue = new TestLinkedQueue<number>();
  testQueue(queue, "Linked queue");

  describe("Priority Queue", () => {
    interface KeyValuePair {
      key: number;
      value: string;
    }
    // The higher the key, the higher the priority.
    const predicate = (a: KeyValuePair, b: KeyValuePair) => {
      if (a.key < b.key) {
        return -1;
      }
      if (a.key === b.key) {
        return 0;
      }
      return 1;
    };

    const testPriorityQueue = (pq: Queue<KeyValuePair>, pqType: string) => {
      describe(pqType, () => {
        it("should enqueue and dequeue correctly", () => {
          pq.enqueue({ key: 3, value: "X" });
          pq.enqueue({ key: 7, value: "Z" });

          expect(pq.peek().value).toBe("Z");

          pq.enqueue({ key: 5, value: "Y" });
          expect(pq.size()).toBe(3);
          expect(pq.dequeue().value).toBe("Z");
          expect(pq.dequeue().value).toBe("Y");

          pq.enqueue({ key: 2, value: "W" });
          expect(pq.peek().value).toBe("X");

          pq.enqueue({ key: 10, value: "A" });
          expect(pq.peek().value).toBe("A");

          pq.enqueue({ key: 5, value: "B" });
          pq.enqueue({ key: 4, value: "C" });
          expect(pq.peek().value).toBe("A");

          pq.clear();
          expect(pq.isEmpty()).toBeTruthy();
          expect(() => pq.peek()).toThrowError("Queue is empty");
          expect(() => pq.dequeue()).toThrowError("Queue is empty");
        });

        it("should handle enqueue edge cases correctly", () => {
          const pq = new LinkedPriorityQueue<KeyValuePair>(predicate);
          pq.enqueue({ key: -3, value: "X" });
          expect(pq.peek().value).toBe("X");

          pq.enqueue({ key: -12, value: "Y" });
          expect(pq.dequeue().value).toBe("X");
          pq.dequeue();
          expect(pq.isEmpty()).toBeTruthy();

          pq.enqueue({ key: 3, value: "A" });
          pq.enqueue({ key: 2, value: "B" });
          pq.enqueue({ key: 4, value: "C" });
          pq.enqueue({ key: 1, value: "D" });

          expect(pq.peek().value).toBe("C");

          // Items with the same priority should go in FIFO order of insertion.
          pq.enqueue({ key: 4, value: "E" });
          expect(pq.dequeue().value).toBe("E");
          expect(pq.peek().value).toBe("C");
        });
      });
    };
    let pq: Queue<KeyValuePair> = new ArrayPriorityQueue<KeyValuePair>(predicate);
    testPriorityQueue(pq, "Array priority queue");
    pq = new LinkedPriorityQueue<KeyValuePair>(predicate);
    testPriorityQueue(pq, "Linked priority queue");
  });
});
