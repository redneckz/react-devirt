import hoistNonReactStatics from 'hoist-non-react-statics';

const REACT_STATIC_FIELDS = [
  'defaultProps',
  'getDerivedStateFromProps',
  'getDerivedStateFromError',
  'childContextTypes',
  'contextTypes',
  'contextType',
];

export function copyReactStatics(FromComponent, ToComponent) {
  ToComponent.displayName = FromComponent.displayName || FromComponent.name;
  REACT_STATIC_FIELDS.filter((field) => field in FromComponent)
    .forEach((field) => {
      ToComponent[field] = FromComponent[field];
    });
  hoistNonReactStatics(ToComponent, FromComponent);
}
