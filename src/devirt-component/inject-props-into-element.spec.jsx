import React from 'react';
import { injectPropsIntoElement } from './inject-props-into-element';

describe('injectPropsIntoElement', () => {
  it('should inject props into single element', () => {
    expect(injectPropsIntoElement(
      { foo: 123 },
    )(
      <div />,
    )).toEqual(
      <div foo={123} />,
    );
  });

  it('should inject props into single element preserving other props and childs', () => {
    expect(injectPropsIntoElement(
      { foo: 123 },
    )(
      <div bar>456</div>,
    )).toEqual(
      <div foo={123} bar>456</div>,
    );
  });

  it('should inject props down to first DOM or custom element of hierarchy', () => {
    const Foo = (props) => <div {...props} />;
    expect(injectPropsIntoElement(
      { foo: 123 },
    )(
      <Foo>
        <div bar>
          <span>456</span>
        </div>
      </Foo>,
    )).toEqual(
      <Foo foo={123}>
        <div bar>
          <span>456</span>
        </div>
      </Foo>,
    );
  });

  it('should overjump special cases like React.Fragment', () => {
    expect(injectPropsIntoElement(
      { foo: 123 },
    )(
      <>
        <div bar>
          <span>456</span>
        </div>
      </>,
    )).toEqual(
      <>
        <div foo={123} bar>
          <span>456</span>
        </div>
      </>,
    );
  });
});
