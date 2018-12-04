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
  RegularComponent.defaultProps = SomeComponent.defaultProps;
  RegularComponent.getDerivedStateFromProps = SomeComponent.getDerivedStateFromProps;
  RegularComponent.getDerivedStateFromError = SomeComponent.getDerivedStateFromError;
  RegularComponent.childContextTypes = SomeComponent.childContextTypes;
  RegularComponent.contextTypes = SomeComponent.contextTypes;
  RegularComponent.contextType = SomeComponent.contextType;
  hoistNonReactStatics(RegularComponent, SomeComponent);
  return RegularComponent;
}
