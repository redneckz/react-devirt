import { decorateRender } from '../decorate-render';
import { injectPropsIntoElement } from './inject-props-into-element';

const DEVIRT_DATA_PREFIX = 'data-devirt-';

export function devirtComponent(createElementData = () => ({})) {
  return (Target) => decorateRender(
    (render) => function devirtualizedRender(...args) {
      const typeName = Target.displayName || Target.name || '';
      const parentTypeName = this.props[`${DEVIRT_DATA_PREFIX}type`];
      const injectedProps = Object.assign(
        ...findoutDataAttrs(this.props), // Pass through parent data attributes
        { [`${DEVIRT_DATA_PREFIX}type`]: parentTypeName ? [typeName, parentTypeName].join() : typeName },
        prefixDataAttrs(createElementData(Target, this.props)),
      );
      return injectPropsIntoElement(
        injectedProps,
      )(
        render.apply(this, args),
      );
    },
  )(
    Target,
  );
}

function findoutDataAttrs(props) {
  return Object.keys(props).filter(
    (key) => key.indexOf(DEVIRT_DATA_PREFIX) === 0,
  ).map(
    (key) => ({ [key]: props[key] }),
  );
}

function prefixDataAttrs(data) {
  return data ? Object.assign(
    {},
    ...Object.keys(data).map(
      (key) => ({ [`${DEVIRT_DATA_PREFIX}${key}`]: data[key] }),
    ),
  ) : {};
}
