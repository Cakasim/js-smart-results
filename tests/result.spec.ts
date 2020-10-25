import { ok, err } from '../dist';

describe('Ok', () => {
  it('value should be correct', () => {
    expect(ok(42).value).toBe(42);
  });

  it('isOk() should return true', () => {
    expect(ok(42).isOk()).toBe(true);
    expect(ok(true).isOk()).toBe(true);
    expect(ok(false).isOk()).toBe(true);
    expect(ok(null).isOk()).toBe(true);
  });

  it('isErr() should return false', () => {
    expect(ok(42).isErr()).toBe(false);
    expect(ok(true).isErr()).toBe(false);
    expect(ok(false).isErr()).toBe(false);
    expect(ok(null).isErr()).toBe(false);
  });

  it('ok() returns Some', () => {
    expect(ok(42).ok().isSome()).toBe(true);
    expect(ok(true).ok().isSome()).toBe(true);
    expect(ok(false).ok().isSome()).toBe(true);
    expect(ok(null).ok().isSome()).toBe(true);
  });

  it('err() returns None', () => {
    expect(ok(42).err().isNone()).toBe(true);
    expect(ok(true).err().isNone()).toBe(true);
    expect(ok(false).err().isNone()).toBe(true);
    expect(ok(null).err().isNone()).toBe(true);
  });

  it('expect() should return a value', () => {
    expect(ok(42).expect(() => 'Boom!')).toBe(42);
    expect(ok(true).expect(() => 'Boom!')).toBe(true);
    expect(ok(false).expect(() => 'Boom!')).toBe(false);
    expect(ok(null).expect(() => 'Boom!')).toBe(null);
  });

  it('map() should map to the correct value', () => {
    expect(ok(42).map(value => `Value ${value}`).value).toBe('Value 42');
  });

  it('mapErr() should do nothing', () => {
    expect(ok(42).mapErr(value => `Error ${value}`).value).toBe(42);
  });

  it('mapOrDefault() should map to the correct value', () => {
    expect(ok(42).mapOrDefault('Value default', value => `Value ${value}`)).toBe('Value 42');
  });

  it('unwrap() should return a value', () => {
    expect(ok(42).unwrap()).toBe(42);
    expect(ok(true).unwrap()).toBe(true);
    expect(ok(false).unwrap()).toBe(false);
    expect(ok(null).unwrap()).toBe(null);
  });

  it('unwrapErr() should throw', () => {
    expect(() => ok(42).unwrapErr()).toThrow(Error);
    expect(() => ok(true).unwrapErr()).toThrow(Error);
    expect(() => ok(false).unwrapErr()).toThrow(Error);
    expect(() => ok(null).unwrapErr()).toThrow(Error);
  });

  it('unwrapOrDefault() should return a value', () => {
    expect(ok(42).unwrapOrDefault(0)).toBe(42);
    expect(ok(true).unwrapOrDefault(false)).toBe(true);
    expect(ok(false).unwrapOrDefault(true)).toBe(false);
    expect(ok('Hello World!').unwrapOrDefault('Some value')).toBe('Hello World!');
  });
});

describe('Err', () => {
  it('value should be correct', () => {
    expect(err(42).value).toBe(42);
  });

  it('isOk() should return false', () => {
    expect(err(42).isOk()).toBe(false);
    expect(err(true).isOk()).toBe(false);
    expect(err(false).isOk()).toBe(false);
    expect(err(null).isOk()).toBe(false);
  });

  it('isErr() should return false', () => {
    expect(err(42).isErr()).toBe(true);
    expect(err(true).isErr()).toBe(true);
    expect(err(false).isErr()).toBe(true);
    expect(err(null).isErr()).toBe(true);
  });

  it('ok() returns None', () => {
    expect(err(42).ok().isNone()).toBe(true);
    expect(err(true).ok().isNone()).toBe(true);
    expect(err(false).ok().isNone()).toBe(true);
    expect(err(null).ok().isNone()).toBe(true);
  });

  it('err() returns Some', () => {
    expect(err(42).err().isSome()).toBe(true);
    expect(err(true).err().isSome()).toBe(true);
    expect(err(false).err().isSome()).toBe(true);
    expect(err(null).err().isSome()).toBe(true);
  });

  it('expect() should throw', () => {
    expect(() => err(42).expect(() => 'Boom!')).toThrow('Boom!');
    expect(() => err(true).expect(() => 'Boom!')).toThrow('Boom!');
    expect(() => err(false).expect(() => 'Boom!')).toThrow('Boom!');
    expect(() => err(null).expect(() => 'Boom!')).toThrow('Boom!');
  });

  it('map() should do nothing', () => {
    expect(err(42).map(value => `Value ${value}`).value).toBe(42);
  });

  it('mapErr() should map to the correct error value', () => {
    expect(err(42).mapErr(value => `Error ${value}`).value).toBe('Error 42');
  });

  it('mapOrDefault() should return the default value', () => {
    expect(err(42).mapOrDefault('Value default', value => `Value ${value}`)).toBe('Value default');
  });

  it('unwrap() should throw', () => {
    expect(() => err(42).unwrap()).toThrow(Error);
    expect(() => err(true).unwrap()).toThrow(Error);
    expect(() => err(false).unwrap()).toThrow(Error);
    expect(() => err(null).unwrap()).toThrow(Error);
  });

  it('unwrapErr() should return the error value', () => {
    expect(err(42).unwrapErr()).toBe(42);
    expect(err(true).unwrapErr()).toBe(true);
    expect(err(false).unwrapErr()).toBe(false);
    expect(err(null).unwrapErr()).toBe(null);
  });

  it('unwrapOrDefault() should return the default value', () => {
    expect(err(42).unwrapOrDefault(0)).toBe(0);
    expect(err(true).unwrapOrDefault(false)).toBe(false);
    expect(err(false).unwrapOrDefault(true)).toBe(true);
    expect(err('Hello World!').unwrapOrDefault('Some value')).toBe('Some value');
  });
});
