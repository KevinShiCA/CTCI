import { HashMap, Hashable } from "../hashmap";

class Integer extends Hashable {
  constructor(private _int: number) {
    super();
  }

  get int() {
    return this._int;
  }

  // Knuth's multiplicative hash function.
  hashCode() {
    return `${this.int * 2654435761 % Math.pow(2, 32) ^ 32}`;
  }

  equals(other: Integer) {
    return other.int === this.int;
  }
}

function getInteger(int: number) {
  return new Integer(int);
}

describe("Hash Map", () => {
  it("should put and get key value pairs correctly", () => {
    const hashmap = new HashMap<Integer, number>();

    hashmap.put(getInteger(3), 5);
    expect(hashmap.get(getInteger(3))).toBe(5);
    hashmap.put(getInteger(3), 6);
    expect(hashmap.get(getInteger(3))).toBe(6);
    expect(hashmap.get(getInteger(4))).toBeUndefined();

    expect(hashmap.containsKey(getInteger(3))).toBeTruthy();
    expect(hashmap.containsValue(6)).toBeTruthy();

    expect(hashmap.containsKey(getInteger(4))).toBeFalsy();
    expect(hashmap.containsValue(5)).toBeFalsy();

    hashmap.clear();
    expect(hashmap.isEmpty()).toBeTruthy();

    hashmap.put(getInteger(4), 1);
    hashmap.put(getInteger(5), 2);
    hashmap.put(getInteger(6), 2);
    // Sort because Hashmaps do not have order.
    expect(hashmap.values().sort()).toEqual([1, 2, 2]);
  });

  it("should resolve collisions using chaining", () => {
    class IntegerCollision extends Integer {
      hashCode() {
        return `${this.int % 3}`;
      }
    }
    function getIntegerCollision(int: number) {
      return new IntegerCollision(int);
    }

    const hashmap = new HashMap<IntegerCollision, number>();
    const four = getIntegerCollision(4);
    const seven = getIntegerCollision(7);
    const ten = getIntegerCollision(10);

    hashmap.put(four, 5);
    hashmap.put(seven, 6);
    expect(hashmap.size).toBe(2);
    expect(hashmap.get(four)).toBe(5);
    expect(hashmap.get(seven)).toBe(6);
    expect(hashmap.containsKey(ten)).toBeFalsy();
    expect(() => hashmap.remove(ten)).toThrowError("Key does not exist: ");

    hashmap.remove(four);
    expect(hashmap.size).toBe(1);
    expect(hashmap.containsKey(four)).toBeFalsy();
    expect(hashmap.containsValue(5)).toBeFalsy();
    expect(hashmap.get(seven)).toBe(6);

    hashmap.remove(seven);
    expect(hashmap.isEmpty()).toBeTruthy();
  });
});
