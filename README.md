# react-devirt

Devirtualize React and reveal virtual DOM as regular DOM for different purposes (E2E testing, browser plugins)

[![NPM Version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

## Installation

```shell
npm install --save @redneckz/react-devirt
```

## How-to

### Basic Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom'
import { devirt } from '@redneckz/react-devirt';

devirt();

const Foo = props => <div {...props} />;

ReactDOM.render(
  <Foo quux>
    <span plugh>baz</span>
  </Foo>,
  document.body,
);
```

will produce

```html
<div data-devirt-type="Foo" quux>
  <span plugh>baz</span>
</div>
```

### Advanced Example

By default only "data-devirt-type" is computed.
Other data attributes can be declared by means of custom props serializer.
All such attributes are prefixed with "data-devirt".

```javascript
import React from 'react';
import ReactDOM from 'react-dom'
import { devirt } from '@redneckz/react-devirt';

devirt((TargetType, { quux, plugh }) => ({ quux, plugh }));

const Foo = ({ children }) => children; // Has no own DOM elements, so invisible
const Bar = ({ plugh, children }) => <div plugh={plugh}>{children}</div>;

ReactDOM.render(
  <Foo quux>
    <Bar plugh>
      <span>baz</span>
    </Bar>
  </Foo>,
  document.body,
);
```

will produce

```html
<div data-devirt-type="Bar,Foo" data-devirt-quux data-devirt-plugh plugh>
  <span>baz</span>
</div>
```

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Freact-devirt.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Freact-devirt
[build-image]: https://cloud.drone.io/api/badges/redneckz/react-devirt/status.svg
[build-url]: https://cloud.drone.io/redneckz/react-devirt
[coveralls-image]: https://coveralls.io/repos/github/redneckz/react-devirt/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/redneckz/react-devirt?branch=master
[bundlephobia-image]: https://badgen.net/bundlephobia/min/@redneckz/react-devirt
[bundlephobia-url]: https://bundlephobia.com/result?p=@redneckz/react-devirt
