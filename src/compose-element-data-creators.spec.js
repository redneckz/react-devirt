import { composeElementDataCreators } from './compose-element-data-creators';

describe('composeElementDataCreators', () => {
  const fooDataCreator = foo => ({ foo });
  const barDataCreator = bar => ({ bar });

  it('should combine two data creators into new one', () => {
    const dataCreator = composeElementDataCreators(fooDataCreator, barDataCreator);
    expect(dataCreator(123)).toEqual({ foo: 123, bar: 123 });
  });

  it('should produce data creator equalent to provided one', () => {
    const dataCreator = composeElementDataCreators(fooDataCreator);
    expect(dataCreator(123)).toEqual({ foo: 123 });
  });

  it('should produce default data creator if nothing provided', () => {
    const dataCreator = composeElementDataCreators();
    expect(dataCreator(123)).toEqual({});
  });

  it('should transparently supply provided data creators with arguments', () => {
    const firstDataCreator = jest.fn();
    const secondDataCreator = jest.fn();
    const dataCreator = composeElementDataCreators(firstDataCreator, secondDataCreator);
    const args = [123, 456, 789];
    dataCreator(...args);
    expect(firstDataCreator).toBeCalledWith(...args);
    expect(secondDataCreator).toBeCalledWith(...args);
  });
});
