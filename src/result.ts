import { Option, none, some } from "./option";

/**
 * Used as value type to prevent use of undefined as value.
 */
type Value<T> = Exclude<T, undefined>;

/**
 * Type of a mapper function which takes an input value
 * and transforms it to an output value of different type.
 */
type Mapper<T, A> = (value: T) => A;

/**
 * Interface for a Result.
 */
interface ResultInterface<T, E>
{
  /**
   * Returns true if the result is of type Ok.
   */
  isOk(): boolean;

  /**
   * Returns true if the result is of type Err.
   */
  isErr(): boolean;

  /**
   * Returns an Option which contains the Ok value if the
   * result is of type Ok.
   */
  ok(): Option<T>;

  /**
   * Returns an Option which contains the Err value if the
   * result is of type Err.
   */
  err(): Option<E>;

  /**
   * Returns the underlying value if the result is of type Ok
   * or throws the return value of the provided function.
   *
   * @param fn Function which returns the value to be thrown.
   */
  expect(fn: () => any): T;

  /**
   * Maps the current result Ok value to a new value of a different type
   * and returns the new Result. If the result is of type Err the
   * method does nothing.
   *
   * @param fn Mapper function which transforms an input to an output value.
   */
  map<A>(fn: Mapper<T, A>): Result<A, E>;

  /**
   * Maps the current result Err value to a new value of a different type
   * and returns the new Result. If the result is of type Ok the
   * method does nothing.
   *
   * @param fn Mapper function which transforms an input to an output value.
   */
  mapErr<A>(fn: Mapper<E, A>): Result<T, A>;

  /**
   * Maps the current result Ok value to a new value of a different type
   * and returns the value. If the result is of type Err the provided
   * default value will be returned.
   *
   * @param def Default value if result is of type Err.
   * @param fn Mapper function which transforms an input to an output value.
   */
  mapOrDefault<A>(def: A, fn: Mapper<T, A>): A;

  /**
   * Unwraps an underlying value of an Ok result. If the result is of type Err
   * the value cannot be unwrapped and an error will be thrown.
   */
  unwrap(): T;

  /**
   * Unwraps an underlying error value of an Err result. If the result is of type Ok
   * the value cannot be unwrapped and an error will be thrown.
   */
  unwrapErr(): E;

  /**
   * Unwraps an underlying value of an Ok result or returns the provided default
   * value if the result is of type Err.
   *
   * @param def Default value if result is of type Err.
   */
  unwrapOrDefault(def: T): T;

}

/**
 * Implementation of ResultInterface for good values.
 */
class Ok<T, E> implements ResultInterface<T, E>
{
  public readonly value: T;

  public constructor(value: T)
  {
    this.value = value;
  }

  public isOk(): this is Ok<T, E>
  {
    return true;
  }

  public isErr(): this is Err<T, E>
  {
    return false;
  }

  public ok(): Option<T>
  {
    return some(this.value as Exclude<T, undefined>);
  }

  public err(): Option<E>
  {
    return none();
  }

  public expect(fn: () => any): T
  {
    // Safely unwrap underlying value here
    return this.unwrap();
  }

  public map<A>(fn: Mapper<T, A>): Result<A, E>
  {
    // Return new Ok with a value got from fn applied to current value
    return new Ok(fn(this.value)) as Result<A, E>;
  }

  public mapErr<A>(fn: Mapper<E, Value<A>>): Result<T, A>
  {
    // Perform noop as this is Ok and we cannot map any error here
    return this as unknown as Result<T, A>;
  }

  public mapOrDefault<A>(def: A, fn: Mapper<T, A>): A
  {
    // Return mapped value, ignore default value
    return fn(this.value);
  }

  public unwrap(): T
  {
    // Simply just unwrap OK value here
    return this.value;
  }

  public unwrapErr(): E
  {
    // Fail to unwrap Err value as there is none
    throw new Error('Cannot unwrap an error from an Ok result.');
  }

  public unwrapOrDefault(def: T): T
  {
    // Safely unwrap underlying value here
    return this.unwrap();
  }
}

/**
 * Implementation of ResultInterface for error values.
 */
class Err<T, E> implements ResultInterface<T, E>
{
  public readonly value: E;

  public constructor(value: E)
  {
    this.value = value;
  }

  public isOk(): this is Ok<T, E>
  {
    return false;
  }

  public isErr(): this is Err<T, E>
  {
    return true;
  }

  public ok(): Option<T>
  {
    return none();
  }

  public err(): Option<E>
  {
    return some(this.value as Exclude<E, undefined>);
  }

  public expect(fn: () => any): T
  {
    // Throw result of provided function
    throw fn();
  }

  public map<A>(fn: Mapper<T, A>): Result<A, E>
  {
    // Perform noop as this is Err and we cannot map any value here
    return this as unknown as Result<A, E>;
  }

  public mapErr<A>(fn: Mapper<E, Value<A>>): Result<T, A>
  {
    // Return new Err with an error got from fn applied to current error
    return new Err(fn(this.value)) as Result<T, A>;
  }

  public mapOrDefault<A>(def: A, fn: Mapper<T, A>): A
  {
    // Return default value, ignore mapping at all
    return def;
  }

  public unwrap(): T
  {
    // Fail to unwrap Ok value as there is none
    throw new Error('Cannot unwrap an value from an Err result.');
  }

  public unwrapErr(): E
  {
    // Simply just unwrap Err value here
    return this.value;
  }

  public unwrapOrDefault(def: T): T
  {
    // Just return def here and ignore mapping
    return def;
  }
}

/**
 * Represents a result which is either Ok or Err.
 */
export type Result<T, E> = Ok<Value<T>, Value<E>> | Err<Value<T>, Value<E>>

/**
 * Creates an Ok result.
 *
 * @param value Underlying value of the Ok result.
 */
export function ok<T, E>(value: Value<T>): Result<T, E>
{
  return new Ok<Value<T>, Value<E>>(value);
}

/**
 * Creates an Err result.
 *
 * @param value Underlying value of the Err result.
 */
export function err<T, E>(value: Value<E>): Result<T, E>
{
  return new Err<Value<T>, Value<E>>(value);
}
