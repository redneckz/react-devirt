import React from 'react';
import TestRenderer from 'react-test-renderer';
import { toRegularComponent } from './to-regular-component';

describe('toRegularComponent', () => {
  it('should return regular (class with render method) components as is', () => {
    // eslint-disable-next-line react/prefer-stateless-function
    class Foo extends React.Component {
      render() {
        return null;
      }
    }
    expect(toRegularComponent(Foo)).toBe(Foo);
  });

  it('should adapt functional component to regular one', () => {
    const RegularFoo = toRegularComponent(() => null);
    expect(RegularFoo.prototype && RegularFoo.prototype.render).toBeTruthy();
  });

  it('should mimic functional component with regular one', () => {
    const Foo = props => <div {...props} />;
    const RegularFoo = toRegularComponent(Foo);
    expect(TestRenderer.create(
      <RegularFoo bar>baz</RegularFoo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <Foo bar>baz</Foo>,
    ).toJSON());
  });
});
