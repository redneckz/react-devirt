import { decorateRender } from './decorate-render';

jest.mock('./to-regular-component', () => ({
  toRegularComponent: (SomeComponent) => SomeComponent,
}));

describe('decorateRender', () => {
  it('should return decorated component as is', () => {
    const decorator = () => {};
    const Target = {};
    Target.prototype = {};
    expect(decorateRender(decorator)(Target)).toBe(Target);
  });

  it('should pass original render method to decorator', () => {
    const decorator = jest.fn();
    const Target = {};
    const render = () => null;
    Target.prototype = { render };
    decorateRender(decorator)(Target);
    expect(decorator).toBeCalledWith(render);
  });

  it('should decorate render method of the provided component', () => {
    const decoratedRender = () => null;
    const decorator = () => decoratedRender;
    const Target = {};
    Target.prototype = {};
    decorateRender(decorator)(Target);
    expect(Target.prototype.render).toBe(decoratedRender);
  });
});
