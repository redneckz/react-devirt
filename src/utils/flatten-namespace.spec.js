import { flattenNamespace } from './flatten-namespace';

describe('flattenNamespace', () => {
  it('should extract all modules from namespace (typically objects) as list', () => {
    expect(flattenNamespace(
      { foo: 123 },
    )).toEqual(
      [123],
    );
  });

  it('should extract all modules from namespace and subnamespaces (typically objects) as list', () => {
    expect(flattenNamespace(
      { foo: { bar: 456 } },
    )).toEqual(
      [{ bar: 456 }, 456],
    );
  });

  it('should return empty list if empty value provided', () => {
    expect(flattenNamespace(null)).toEqual([]);
    expect(flattenNamespace(undefined)).toEqual([]);
  });
});
