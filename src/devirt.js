import React from 'react';
import { composeElementDataCreators } from './compose-element-data-creators';
import { devirtComponent } from './devirt-component';

export function devirt(createElementData) {
  devirt.createElementData = composeElementDataCreators(
    devirt.createElementData,
    createElementData,
  );

  if (!devirt.createElement) {
    devirt.createElement = React.createElement;
    React.createElement = function devirtElement(type, ...rest) {
      return devirt.createElement(devirtType(type), ...rest);
    };
  }
}

devirt.reset = () => {
  if (devirt.createElement) {
    React.createElement = devirt.createElement;
    delete devirt.createElement;
    delete devirt.createElementData;
  }
};

function devirtType(type) {
  if (typeof type !== 'function') {
    // No need to devirtualize DOM components and special cases
    return type;
  }
  if (!type.Devirtualized) {
    type.Devirtualized = devirtComponent(devirt.createElementData)(type);
  }
  return type.Devirtualized;
}
