import React from 'react';

export function injectPropsIntoElement(injectedProps) {
  const injectProps = (el) => {
    if (!isKnownElement(el)) {
      // Precondition
      return el;
    }
    if (isDOMElement(el) || isCustomElement(el)) {
      // End of recursion
      return React.cloneElement(el, injectedProps);
    }
    if (el.props && el.props.children) {
      // Go deeper
      return React.cloneElement(
        el,
        null, // Overjump special cases like React.Fragment
        Array.isArray(el.props.children)
          ? React.Children.map(el.props.children, injectProps)
          : injectProps(el.props.children),
      );
    }
    return el;
  };
  return injectProps;
}

function isKnownElement(el) {
  return el && el.type;
}

function isDOMElement(el) {
  return el && typeof el.type === 'string';
}

function isCustomElement(el) {
  return el && typeof el.type === 'function';
}
