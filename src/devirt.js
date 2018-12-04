import React from 'react';
import { devirtComponent } from './devirt-component';

export function devirt(createElementData) {
  const { createElement } = React;
  // eslint-disable-next-line no-param-reassign
  React.createElement = function devirtElement(type, ...rest) {
    return createElement(devirtType(type), ...rest);
  };

  function devirtType(type) {
    if (typeof type !== 'function') {
      // No need to devirtualize DOM components and special cases
      return type;
    }
    if (!type.Devirtualized) {
      // eslint-disable-next-line no-param-reassign
      type.Devirtualized = devirtComponent(createElementData)(type);
    }
    return type.Devirtualized;
  }
}
