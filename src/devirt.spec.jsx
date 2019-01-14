import React from 'react';
import TestRenderer from 'react-test-renderer';
import { devirt } from './devirt';

// Integrational test
describe('devirt', () => {
  beforeEach(devirt.reset);

  describe('should devirtualize React', () => {
    it('should reveal component types ("data-devirt-type" attribute)', () => {
      devirt();

      const Foo = props => <div {...props} />;
      expect(TestRenderer.create(
        <Foo quux>
          <span plugh>baz</span>
        </Foo>,
      ).toJSON()).toEqual(TestRenderer.create(
        <div data-devirt-type="Foo" quux>
          <span plugh>baz</span>
        </div>,
      ).toJSON());
    });

    it('should reveal types of all "invisible" ancestors ("data-devirt-type" attribute)', () => {
      devirt();

      const Foo = ({ children }) => children;
      const Bar = ({ quux, children }) => <div quux={quux}>{children}</div>;
      expect(TestRenderer.create(
        <Foo>
          <Bar quux>
            <span>baz</span>
          </Bar>
        </Foo>,
      ).toJSON()).toEqual(TestRenderer.create(
        <div data-devirt-type="Bar,Foo" quux>
          <span>baz</span>
        </div>,
      ).toJSON());
    });

    it('should reveal some props by means of data attributes', () => {
      const createElementData = (Target, { bar }) => ({ bar });
      devirt(createElementData);

      const Foo = props => <div {...props} />;
      expect(TestRenderer.create(
        <Foo bar>
          <span>baz</span>
        </Foo>,
      ).toJSON()).toEqual(TestRenderer.create(
        <div data-devirt-type="Foo" data-devirt-bar bar>
          <span>baz</span>
        </div>,
      ).toJSON());
    });
  });

  it('should combine settings (createElementData) from several calls', () => {
    devirt((Target, { baz }) => ({ baz })); // First call
    devirt((Target, { quux }) => ({ quux })); // Second call

    const Foo = props => <div {...props} />;
    expect(TestRenderer.create(
      <Foo bar baz quux={123}>
        <span quux>baz</span>
      </Foo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Foo" data-devirt-baz data-devirt-quux={123} bar baz quux={123}>
        <span quux>baz</span>
      </div>,
    ).toJSON());
  });
});
