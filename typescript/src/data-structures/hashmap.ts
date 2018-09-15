import { LinkedList } from "./linked-list";

export abstract class Hashable {
  abstract hashCode(): string;
  abstract equals(other: any): boolean;
}

interface MapNode<K, V> {
  key: K;
  value: V;
}

export class HashMap<K extends Hashable, V> {
  private map: { [s: string]: LinkedList<MapNode<K, V>> };
  private _size: number;

  constructor() {
    this.map = {};
    this._size = 0;
  }

  put(key: K, value: V) {
    const hashCode = key.hashCode();
    if (!this.map[hashCode]) {
      this.map[hashCode] = new LinkedList<MapNode<K, V>>();
    }

    const existingValue = this.map[hashCode].find(item => item.key.equals(key));
    if (existingValue) {
      existingValue.value = value;
      return;
    }

    this.map[hashCode].append({ key, value });
    this._size++;
  }

  get(key: K) {
    const hashCode = key.hashCode();
    if (!this.map[hashCode]) {
      return undefined;
    }
    const result = this.map[hashCode].find(item => item.key.equals(key));
    return result ? result.value : undefined;
  }

  remove(key: K) {
    const hashCode = key.hashCode();
    if (!this.map[hashCode] || !this.map[hashCode].find(item => item.key.equals(key))) {
      throw new Error(`Key does not exist: ${key}`);
    }
    this.map[hashCode].removeAll(item => item.key.equals(key));
    this._size--;
    if (this.map[hashCode].size === 0) {
      delete this.map[hashCode];
    }
  }

  containsKey(key: K) {
    return !!this.get(key);
  }

  containsValue(value: V) {
    for (const key in this.map) {
      if (this.map[key].find(item => item.value === value)) {
        return true;
      }
    }
    return false;
  }

  values() {
    let result: V[] = [];
    for (const key in this.map) {
      result = result.concat(this.map[key].mapToArray(item => item.value));
    }
    return result;
  }

  clear() {
    this.map = {};
    this._size = 0;
  }

  isEmpty() {
    return Object.keys(this.map).length === 0;
  }

  get size() {
    return this._size;
  }
}
