type Value<T> = Exclude<T, undefined>;
type Mapper<T, A> = (value: T) => A;

interface OptionInterface<T>
{
  /**
   * Returns true if the option is of type Some.
   */
  isSome(): boolean;

  /**
   * Returns true if the option is of type None.
   */
  isNone(): boolean;

  /**
   * Returns the underlying value if the option is of type Some
   * or throws the return value of the provided function.
   *
   * @param fn Function which returns the value to be thrown.
   */
  expect(fn: () => any): T;

  /**
   * Maps the current option Some value to a new value of a different type
   * and returns the new Option. If the option is of type None the
   * method does nothing.
   *
   * @param fn Mapper function which transforms an input to an output value.
   */
  map<A>(fn: Mapper<T, A>): Option<A>;

  /**
   * Maps the current option Some value to a new value of a different type
   * and returns the value. If the option is of type None the provided
   * default value will be returned.
   *
   * @param def Default value if option is of type None.
   * @param fn Mapper function which transforms an input to an output value.
   */
  mapOrDefault<A>(def: A, fn: Mapper<T, A>): A;

  /**
   * Unwraps an underlying value of a Some option. If the option is of type None
   * the value cannot be unwrapped and an error will be thrown.
   */
  unwrap(): T;

  /**
   * Unwraps an underlying value of a Some option or returns the provided default
   * value if the option is of type None.
   *
   * @param def Default value if option is of type None.
   */
  unwrapOrDefault(def: T): T;
}

class Some<T> implements OptionInterface<T>
{
  public readonly value: T;

  public constructor(value: T)
  {
    this.value = value;
  }

  public isSome(): this is Some<T>
  {
    return true;
  }

  public isNone(): this is None<T>
  {
    return false;
  }

  public expect(fn: () => any): T
  {
    return this.unwrap();
  }

  public map<A>(fn: Mapper<T, A>): Option<A>
  {
    return new Some(fn(this.value)) as Option<A>;
  }

  public mapOrDefault<A>(def: A, fn: Mapper<T, A>): A
  {
    return fn(this.value);
  }

  public unwrap(): T
  {
    return this.value;
  }

  public unwrapOrDefault(def: T): T
  {
    return this.unwrap();
  }
}

class None<T> implements OptionInterface<T>
{
  public readonly value = null;

  public isSome(): this is Some<T>
  {
    return false;
  }

  public isNone(): this is None<T>
  {
    return true;
  }

  public expect(fn: () => any): T
  {
    throw fn();
  }

  public map<A>(fn: Mapper<T, A>): Option<A>
  {
    return this as unknown as Option<A>;
  }

  public mapOrDefault<A>(def: A, fn: Mapper<T, A>): A
  {
    return def;
  }

  public unwrap(): T
  {
    throw new Error('Cannot unwrap a value from None.');
  }

  public unwrapOrDefault(def: T): T
  {
    return def;
  }
}

/**
 * Represents an option which is either Some or None.
 */
export type Option<T> = Some<Value<T>> | None<Value<T>>;

/**
 * Creates a Some option.
 *
 * @param value Underlying value of the Some option.
 */
export function some<T>(value: Value<T>): Option<T>
{
  return new Some(value) as Option<T>;
}

/**
 * Creates a None option.
 */
export function none<T>(): Option<T>
{
  return new None() as Option<T>;
}
