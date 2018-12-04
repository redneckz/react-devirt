import { decorateRender } from '../decorate-render';
import { injectPropsIntoElement } from './inject-props-into-element';

export function devirtComponent(createElementData = () => ({})) {
  return Target => decorateRender(
    render => function devirtualizedRender(...args) {
      const typeName = Target.displayName || Target.name || '';
      const parentTypeName = this.props['data-devirt-type'];
      const injectedProps = Object.assign(
        { type: parentTypeName ? [typeName, parentTypeName].join() : typeName },
        createElementData(Target, this.props),
      );
      return injectPropsIntoElement(
        prefixDataAttrs(injectedProps),
      )(
        render.apply(this, args),
      );
    },
  )(
    Target,
  );
}

function prefixDataAttrs(data) {
  return Object.assign(
    {},
    ...Object.keys(data).map(
      key => ({ [`data-devirt-${key}`]: data[key] }),
    ),
  );
}
