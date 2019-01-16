import { LinkedList } from "../linked-list";

describe("Linked List", () => {
  let ll: LinkedList<number>;

  beforeEach(() => {
    ll = new LinkedList<number>();
  });

  afterEach(() => {
    ll = undefined;
  });

  it("should append elements correctly", () => {
    ll.append(1);
    ll.append(2);
    ll.append(3);
    expect(ll.toArray()).toEqual([1, 2, 3]);

    ll.clear();
    expect(ll.isEmpty()).toBeTruthy();
  });

  it("should add, remove, and get elements by index correctly", () => {
    ll.add(10, 0);
    ll.add(20, 0);
    expect(ll.get(1)).toBe(10);
    ll.add(30, 1);
    expect(ll.toArray()).toEqual([20, 30, 10]);

    ll.removeAt(1);
    expect(ll.toArray()).toEqual([20, 10]);

    ll.add(40, 2);
    expect(ll.toArray()).toEqual([20, 10, 40]);

    ll.add(50, 1);
    ll.add(60, 1);
    ll.add(70, 2);
    expect(ll.toArray()).toEqual([20, 60, 70, 50, 10, 40]);

    expect(() => ll.add(11, 123)).toThrowError("Index out of bounds: 123");
    expect(() => ll.add(11, -10)).toThrowError("Index out of bounds: -10");

    expect(() => ll.get(123)).toThrowError("Index out of bounds: 123");
    expect(() => ll.get(-10)).toThrowError("Index out of bounds: -10");

    expect(() => ll.removeAt(123)).toThrowError("Index out of bounds: 123");
    expect(() => ll.removeAt(-10)).toThrowError("Index out of bounds: -10");

    expect(ll.contains(20)).toBeTruthy();
    expect(ll.contains(30)).toBeFalsy();

    expect(ll.indexOf(60)).toBe(1);
    // Add a duplicate value, indexOf should find the first occurence.
    ll.append(50);
    expect(ll.indexOf(50)).toBe(3);
    expect(ll.indexOf(12345)).toBe(-1);

    ll.removeAt(1);
    expect(ll.toArray()).toEqual([20, 70, 50, 10, 40, 50]);

    ll.removeAt(4);
    expect(ll.toArray()).toEqual([20, 70, 50, 10, 50]);

    ll.removeAt(0);
    expect(ll.get(0)).toBe(70);
    ll.removeAt(ll.size - 1);
    expect(ll.get(ll.size - 1)).toBe(10);

    ll.clear();
    ll.appendAll([1, 2, 3, 4]);
    expect(ll.removeAt(3)).toBe(4);

    ll.clear();
    ll.append(1);
    expect(ll.removeAt(0)).toBe(1);
  });

  it("should map to array and linked list correctly", () => {
    ll.appendAll([1, 2, 3]);
    expect(ll.mapToArray(value => value * value)).toEqual([1, 4, 9]);
    expect(ll.mapToLinkedList(value => value * value).toArray()).toEqual([1, 4, 9]);
  });

  it("should filter to array and linked list correctly", () => {
    ll.appendAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(ll.filterToArray(value => value % 2 === 0)).toEqual([2, 4, 6, 8, 10]);
    expect(ll.filterToLinkedList(value => value % 2 !== 0).toArray()).toEqual([1, 3, 5, 7, 9]);
  });

  it("should find a value by predicate correctly", () => {
    ll.appendAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(ll.find(value => value % 2 === 0)).toBe(2);
    expect(ll.find(value => value > 10)).toBeUndefined();
  });

  it("should append arrays and linked lists correctly", () => {
    ll.appendAll([1, 2, 3]);
    expect(ll.size).toBe(3);

    const ll2 = new LinkedList<number>();
    ll2.appendAll(ll);
    expect(ll2.size).toBe(3);
    expect(ll.toArray()).toEqual(ll2.toArray());
  });

  it("should remove by value correctly", () => {
    ll.appendAll([1, 2, 3]);
    ll.remove(2);

    expect(ll.toArray()).toEqual([1, 3]);
    expect(() => ll.remove(4)).toThrowError("Value not found: 4");
    ll.clear();

    ll.appendAll([1, 2, 3, 4, 5]);
    ll.remove(1);
    expect(ll.toArray()).toEqual([2, 3, 4, 5]);
    ll.remove(5);
    expect(ll.toArray()).toEqual([2, 3, 4]);
    ll.clear();

    ll.appendAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    ll.removeAll(value => value % 2 === 0);
    expect(ll.toArray()).toEqual([1, 3, 5, 7, 9]);
    ll.removeAll(value => value < 4);
    expect(ll.toArray()).toEqual([5, 7, 9]);
    ll.removeAll(value => value === 5);
    expect(ll.toArray()).toEqual([7, 9]);
    ll.removeAll(value => value === 7 || value === 9);
    expect(ll.isEmpty()).toBeTruthy();
  });

  it("should convert to string correctly", () => {
    expect(ll.toString()).toBe("EMPTY LIST");
    ll.append(1);
    expect(ll.toString()).toBe("1");
    ll.append(2);
    expect(ll.toString()).toBe("1 -> 2");
    ll.appendAll([3, 4, 5]);
    expect(ll.toString()).toBe("1 -> 2 -> 3 -> 4 -> 5");
  });
});
