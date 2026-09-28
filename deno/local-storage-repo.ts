/**
 * A naive storage for toy apps in deno
 */

type LocalStorageRepositoryOptions<T> = {
  prefix: string;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

export class LocalStorageRepository<T extends { id: string }> {
  private readonly prefix: string;
  private readonly serialize: (value: T) => string;
  private readonly deserialize: (value: string) => T;

  constructor(options: LocalStorageRepositoryOptions<T>) {
    this.prefix = options.prefix;
    this.serialize = options.serialize ?? JSON.stringify;
    this.deserialize = options.deserialize ?? JSON.parse;
  }

  create(value: T): void {
    localStorage.setItem(
      `${this.prefix}:${value.id}`,
      this.serialize(value),
    );
  }

  get(id: string): T | null {
    const value = localStorage.getItem(`${this.prefix}:${id}`);
    return value ? this.deserialize(value) : null;
  }

  getAll(): T[] {
    const values: T[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key?.startsWith(`${this.prefix}:`)) {
        values.push(this.deserialize(localStorage.getItem(key)!));
      }
    }

    return values;
  }

  update(value: T): void {
    localStorage.setItem(
      `${this.prefix}:${value.id}`,
      this.serialize(value),
    );
  }

  delete(id: string): void {
    localStorage.removeItem(`${this.prefix}:${id}`);
  }
}
