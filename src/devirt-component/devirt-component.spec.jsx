import React from 'react';
import TestRenderer from 'react-test-renderer';
import { devirtComponent } from './devirt-component';

describe('devirtComponent', () => {
  it('should reveal component type ("data-devirt-type" attribute)', () => {
    const Foo = props => <div {...props} />;
    const DevirtFoo = devirtComponent()(Foo);
    expect(TestRenderer.create(
      <DevirtFoo quux>
        <span plugh>baz</span>
      </DevirtFoo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Foo" quux>
        <span plugh>baz</span>
      </div>,
    ).toJSON());
  });

  it('should reveal types of all "invisible" ancestors ("data-devirt-type" attribute)', () => {
    const Foo = ({ children }) => children; // Has no own DOM elements, so invisible
    const Bar = props => <div {...props} />;
    const DevirtFoo = devirtComponent()(Foo);
    const DevirtBar = devirtComponent()(Bar);
    expect(TestRenderer.create(
      <DevirtFoo>
        <DevirtBar quux>
          <span plugh>baz</span>
        </DevirtBar>
      </DevirtFoo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Bar,Foo" quux>
        <span plugh>baz</span>
      </div>,
    ).toJSON());
  });

  it('should reveal some props by means of data attributes', () => {
    const Foo = props => <div {...props} />;
    const createElementData = (Target, { bar }) => ({ bar });
    const DevirtFoo = devirtComponent(createElementData)(Foo);
    expect(TestRenderer.create(
      <DevirtFoo bar>
        <span quux>baz</span>
      </DevirtFoo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Foo" data-devirt-bar bar>
        <span quux>baz</span>
      </div>,
    ).toJSON());
  });
});
