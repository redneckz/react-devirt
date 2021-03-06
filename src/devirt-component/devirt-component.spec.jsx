import React from 'react';
import TestRenderer from 'react-test-renderer';
import { devirtComponent } from './devirt-component';

describe('devirtComponent', () => {
  it('should reveal component type ("data-devirt-type" attribute)', () => {
    const Foo = (props) => <div {...props} />;

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
    const Bar = ({ quux, children }) => <div quux={quux}>{children}</div>;

    const DevirtFoo = devirtComponent()(Foo);
    const DevirtBar = devirtComponent()(Bar);

    expect(TestRenderer.create(
      <DevirtFoo>
        <DevirtBar quux>
          <span>baz</span>
        </DevirtBar>
      </DevirtFoo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Bar,Foo" quux>
        <span>baz</span>
      </div>,
    ).toJSON());
  });

  it('should reveal some props by means of data attributes', () => {
    const Foo = (props) => <div {...props} />;
    const createElementData = (Target, { bar }) => ({ bar });

    const DevirtFoo = devirtComponent(createElementData)(Foo);

    expect(TestRenderer.create(
      <DevirtFoo bar>
        <span>baz</span>
      </DevirtFoo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Foo" data-devirt-bar bar>
        <span>baz</span>
      </div>,
    ).toJSON());
  });

  it('should override default behaviour related to data-devirt-type by means of createElementData', () => {
    const Foo = (props) => <div {...props} />;
    const createElementData = (Target, { suffix }) => ({ type: `${Target.name}::${suffix}` });

    const DevirtFoo = devirtComponent(createElementData)(Foo);

    expect(TestRenderer.create(
      <DevirtFoo suffix="suffix" />,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Foo::suffix" suffix="suffix" />,
    ).toJSON());
  });

  it('should accumulate data attributes from "invisible" ancestors', () => {
    const Foo = ({ children }) => children;
    const Bar = ({ quux, children }) => <div quux={quux}>{children}</div>;

    const DevirtFoo = devirtComponent((Target, { plugh }) => ({ foo: plugh }))(Foo);
    const DevirtBar = devirtComponent((Target, { quux }) => ({ bar: quux }))(Bar);

    expect(TestRenderer.create(
      <DevirtFoo plugh>
        <DevirtBar quux>
          <span>baz</span>
        </DevirtBar>
      </DevirtFoo>,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Bar,Foo" data-devirt-foo data-devirt-bar quux>
        <span>baz</span>
      </div>,
    ).toJSON());
  });

  it('should devirt functional components with hooks inside', () => {
    const effect = jest.fn();
    const Foo = (props) => {
      React.useEffect(effect, []);
      return <div {...props} />;
    };

    const DevirtFoo = devirtComponent()(Foo);

    expect(TestRenderer.create(
      <DevirtFoo />,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Foo" />,
    ).toJSON());
    expect(effect).toBeCalledTimes(1);
  });

  it('should devirt regular components with life cycle methods', () => {
    const effect = jest.fn();
    class Foo extends React.Component {
      componentDidMount() {
        effect();
      }

      render() {
        return <div {...this.props} />;
      }
    }

    const DevirtFoo = devirtComponent()(Foo);

    expect(TestRenderer.create(
      <DevirtFoo />,
    ).toJSON()).toEqual(TestRenderer.create(
      <div data-devirt-type="Foo" />,
    ).toJSON());
    expect(effect).toBeCalledTimes(1);
  });
});
