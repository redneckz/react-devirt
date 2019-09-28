import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function toRegularComponent(SomeComponent) {
  if (SomeComponent.prototype && SomeComponent.prototype.render) {
    // Already regular
    return SomeComponent;
  }

  const RegularComponent = class extends React.Component {
    render() {
      return SomeComponent(this.props, this.context);
    }
  };
  RegularComponent.displayName = SomeComponent.displayName || SomeComponent.name;
  [
    'defaultProps',
    'getDerivedStateFromProps',
    'getDerivedStateFromError',
    'childContextTypes',
    'contextTypes',
    'contextType',
  ].filter((field) => field in SomeComponent)
    .forEach((field) => {
      RegularComponent[field] = SomeComponent[field];
    });
  hoistNonReactStatics(RegularComponent, SomeComponent);
  return RegularComponent;
}
