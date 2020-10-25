import { some, none } from '../dist';

describe('Some', () => {
  it('value should be correct', () => {
    expect(some(42).value).toBe(42);
  });

  it('isSome() should return true', () => {
    expect(some(42).isSome()).toBe(true);
    expect(some(true).isSome()).toBe(true);
    expect(some(false).isSome()).toBe(true);
    expect(some(null).isSome()).toBe(true);
  });

  it('isNone() should return false', () => {
    expect(some(42).isNone()).toBe(false);
    expect(some(true).isNone()).toBe(false);
    expect(some(false).isNone()).toBe(false);
    expect(some(null).isNone()).toBe(false);
  });

  it('expect() should return a value', () => {
    expect(some(42).expect(() => 'Boom!')).toBe(42);
    expect(some(true).expect(() => 'Boom!')).toBe(true);
    expect(some(false).expect(() => 'Boom!')).toBe(false);
    expect(some(null).expect(() => 'Boom!')).toBe(null);
  });

  it('map() should map to the correct value', () => {
    expect(some(42).map(value => `Value ${value}`).value).toBe('Value 42');
  });

  it('mapOrDefault() should map to the correct value', () => {
    expect(some(42).mapOrDefault('Value default', value => `Value ${value}`)).toBe('Value 42');
  });

  it('unwrap() should return a value', () => {
    expect(some(42).unwrap()).toBe(42);
    expect(some(true).unwrap()).toBe(true);
    expect(some(false).unwrap()).toBe(false);
    expect(some(null).unwrap()).toBe(null);
  });

  it('unwrapOrDefault() should return a value', () => {
    expect(some(42).unwrapOrDefault(0)).toBe(42);
    expect(some(true).unwrapOrDefault(false)).toBe(true);
    expect(some(false).unwrapOrDefault(true)).toBe(false);
    expect(some('Hello World!').unwrapOrDefault('Some value')).toBe('Hello World!');
  });
});

describe('None', () => {
  it('value should be null', () => {
    expect(none().value).toBe(null);
  });

  it('isSome() should return false', () => {
    expect(none().isSome()).toBe(false);
  });

  it('isNone() should return true', () => {
    expect(none().isNone()).toBe(true);
  });

  it('expect() should throw', () => {
    expect(() => none().expect(() => 'Boom!')).toThrow('Boom!');
  });

  it('map() should do nothing', () => {
    expect(none().map(value => `Value ${value}`).value).toBe(null);
  });

  it('mapOrDefault() should return the default value', () => {
    expect(none().mapOrDefault('Value default', value => `Value ${42}`)).toBe('Value default');
  });

  it('unwrap() should throw', () => {
    expect(() => none().unwrap()).toThrow(Error);
  });

  it('unwrapOrDefault() should return the default value', () => {
    expect(none().unwrapOrDefault(0)).toBe(0);
    expect(none().unwrapOrDefault(false)).toBe(false);
    expect(none().unwrapOrDefault(true)).toBe(true);
    expect(none().unwrapOrDefault(null)).toBe(null);
  });
});
