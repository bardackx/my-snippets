const COUNT_MUST_BE_POSITIVE = "Count must be a positive integer.";
const SIZE_MUST_BE_POSITIVE = "Size must be a positive integer.";

export function replacer(_key: string, value: unknown) {
  if (value instanceof Set) {
    return { __type: "Set", value: Array.from(value) };
  }
  if (value instanceof Map) {
    return { __type: "Map", value: Array.from(value.entries()) };
  }
  if (value instanceof MultiSet) {
    const record: Record<string, number> = {};
    for (const [k, v] of value.entries()) {
      record[k] = v;
    }
    return { __type: "MultiSet", value: record };
  }
  return value;
}

export function reviver(_key: string, value: any) {
  if (value && value.__type === "Set") {
    return new Set(value.value);
  }
  if (value && value.__type === "Map") {
    return new Map(value.value);
  }
  if (value && value.__type === "MultiSet") {
    const map = new Map<string, number>();
    for (const [k, v] of Object.entries(value.value)) {
      map.set(k, Number.parseInt("" + v));
    }
    return new MultiSet(map);
  }
  return value;
}

// helper function to calculate combinations
function combination(n: number, k: number): number {
  if (k > n) {
    return 0;
  }

  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i) / (i + 1);
  }

  return result;
}

export class ReadonlyMultiSet<T> {
  protected readonly map: Map<T, number>;

  constructor(map: Map<T, number> = new Map()) {
    this.map = map;
  }

  contains(element: T, count: number = 1): boolean {
    if (count <= 0) {
      throw new Error(COUNT_MUST_BE_POSITIVE);
    }

    const currentCount = this.map.get(element) ?? 0;
    return currentCount >= count;
  }

  containsMultiSet(other: ReadonlyMultiSet<T>): boolean {
    for (const [element, count] of other.map) {
      if (!this.contains(element, count)) {
        return false;
      }
    }
    return true;
  }

  count(element: T): number {
    return this.map.get(element) ?? 0;
  }

  size(): number {
    let total = 0;
    for (const count of this.map.values()) {
      total += count;
    }
    return total;
  }

  uniqueSet(): Set<T> {
    return new Set(this.map.keys());
  }

  uniqueSize(): number {
    return this.map.size;
  }

  intersects(set: Set<T>): unknown {
    if (set.size < this.map.size) {
      for (const key of set) {
        if (this.map.has(key)) {
          return true;
        }
      }
    } else {
      for (const key of this.map.keys()) {
        if (set.has(key)) {
          return true;
        }
      }
    }
    return false;
  }

  probabilityOf(element: T): number {
    const elementCount = this.count(element);
    const totalSize = this.size();
    return totalSize === 0 ? 0 : elementCount / totalSize;
  }

  /**
   * Returns the probability of getting the given multiset after drawing exactly
   * N elements out of this multiset; where N is the size of the given multiset.
   *
   * For example if *this* is multiset is {A, A, B, B}
   *
   * | Input   | N | Chance |
   * |---------|:-:|-------:|
   * | {A, A}  | 2 |  1/6   |
   * | {A, B}  | 2 |  4/6   |
   * | {B, B}  | 2 |  1/6   |
   * | {A}     | 1 |  1/2   |
   * | {B}     | 1 |  1/2   |
   */
  probabilityOfMultiSet(multiset: ReadonlyMultiSet<T>): number {
    const totalSize = this.size();
    const multisetSize = multiset.size();

    if (totalSize < multisetSize) {
      return 0; // impossible to draw the multiset
    }

    let numerator = 1;
    const denominator = combination(totalSize, multisetSize);

    for (const [element, count] of multiset.entries()) {
      const elementCount = this.count(element);
      if (elementCount < count) {
        return 0; // impossible to draw the multiset
      }

      numerator *= combination(elementCount, count);
    }

    return numerator / denominator;
  }

  getSubMultiSets(size: number): Array<MultiSet<T>> {
    if (size < 0) {
      throw new Error(SIZE_MUST_BE_POSITIVE);
    }

    if (size === 0) {
      return [new MultiSet()];
    }

    const result: Array<MultiSet<T>> = [];
    const entries = Array.from(this.map.entries());
    const current = new Map<T, number>();

    const backtrack = (
      index: number,
      remaining: number,
    ) => {
      if (remaining === 0) {
        result.push(new MultiSet(new Map(current)));
        return;
      }

      if (index >= entries.length || remaining < 0) {
        return;
      }

      const [element, count] = entries[index];

      for (let i = 0; i <= Math.min(count, remaining); i++) {
        if (i > 0) current.set(element, i);
        backtrack(index + 1, remaining - i);
        if (i > 0) current.delete(element);
      }
    };

    backtrack(0, size);
    return result;
  }

  toString() {
    const keys = Array.from(this.map.keys()).toSorted((a, b) => {
      const sa = "" + a;
      const sb = "" + b;
      if (sa < sb) return -1;
      if (sa > sb) return +1;
      return 0;
    });
    const obj: { [key: string]: number } = {};
    for (const key of keys) {
      const keyAsString = "" + key;
      obj[keyAsString] = this.map.get(key) ?? 0;
    }
    return JSON.stringify(obj, null, 2);
  }

  equals<U extends T>(other: MultiSet<U>): boolean {
    const map1 = this.map;
    const map2 = other.map;
    if (map1.size !== map2.size) {
      return false;
    }
    for (const [key, value] of map2) {
      if (!map1.has(key) || map1.get(key) !== value) {
        return false;
      }
    }
    return true;
  }

  getTopMostLikelySubMultiSets(
    size: number,
    top: number,
  ): Array<ReadonlyMultiSet<T>> {
    if (size <= 0) {
      throw new Error(SIZE_MUST_BE_POSITIVE);
    }
    if (top <= 0) {
      throw new Error("Top must be a positive integer.");
    }

    const subMultiSetsWithProbabilities = this
      .getSubMultiSets(size)
      .map((subMultiSet) => ({
        subMultiSet,
        probability: this.probabilityOfMultiSet(subMultiSet),
      }));

    subMultiSetsWithProbabilities.sort((a, b) => b.probability - a.probability);

    return subMultiSetsWithProbabilities.slice(0, top).map((obj) =>
      obj.subMultiSet
    );
  }

  entries(): ReadonlyArray<[T, number]> {
    return Array.from(this.map.entries());
  }

  copy() {
    const copy = new Map();
    this.map.forEach((value, key) => {
      copy.set(key, value);
    });
    return new MultiSet(copy);
  }
}

export class MultiSet<T> extends ReadonlyMultiSet<T> {
  mask<U extends T>(mask: ReadonlySet<U>): MultiSet<U> {
    for (const key of this.uniqueSet()) {
      if (mask.has(key as U)) {
        continue;
      }
      this.map.delete(key);
    }
    return this as unknown as MultiSet<U>;
  }

  set(src: MultiSet<T>): this {
    this.map.clear();
    for (const [key, value] of src.map) {
      this.map.set(key, value);
    }
    return this;
  }

  add(element: T, count: number = 1): this {
    if (count <= 0) {
      throw new Error(COUNT_MUST_BE_POSITIVE);
    }

    const currentCount = this.map.get(element) ?? 0;
    this.map.set(element, currentCount + count);

    return this;
  }

  remove(element: T, count: number = 1): this {
    if (count <= 0) {
      throw new Error(COUNT_MUST_BE_POSITIVE);
    }

    const currentCount = this.map.get(element);
    if (currentCount === undefined || currentCount < count) {
      throw new Error(
        `Not enough occurrences of ${element} to remove (tried to remove ${count}, present was ${currentCount}).`,
      );
    }

    if (currentCount === count) {
      this.map.delete(element);
    } else {
      this.map.set(element, currentCount - count);
    }

    return this;
  }

  addMultiset(other: ReadonlyMultiSet<T>): this {
    for (const [element, count] of other.entries()) {
      const currentCount = this.map.get(element) ?? 0;
      this.map.set(element, currentCount + count);
    }
    // waaaaait, this is not type safe! this should be a concatMultiset that allocates a new multiset
    return this;
  }

  removeMultiset(other: ReadonlyMultiSet<T>): this {
    for (const [element, count] of other.entries()) {
      const currentCount = this.map.get(element);
      if (currentCount === undefined || currentCount < count) {
        throw new Error(
          `Not enough occurrences of ${element} to remove (tried to remove ${count}, present was ${currentCount}).`,
        );
      }

      if (currentCount === count) {
        this.map.delete(element);
      } else {
        this.map.set(element, currentCount - count);
      }
    }
    return this;
  }

  removeAll(element: T) {
    this.map.delete(element);
  }

  clear(): this {
    this.map.clear();
    return this;
  }
}
