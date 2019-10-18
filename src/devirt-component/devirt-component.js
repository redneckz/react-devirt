import { decorateRender } from '../decorate-render';
import { injectPropsIntoElement } from './inject-props-into-element';

const DEVIRT_DATA_PREFIX = 'data-devirt-';
const DEVIRT_TYPE_DATA_ATTR = `${DEVIRT_DATA_PREFIX}type`;

export function devirtComponent(createElementData = () => ({})) {
  return (Target) => decorateRender(
    (props) => {
      const injectedProps = Object.assign(
        ...findoutDataAttrs(props), // Pass through parent data attributes
        computeDevirtTypeDataAttr(Target, props),
        prefixDataAttrs(createElementData(Target, props)),
      );
      return injectPropsIntoElement(injectedProps);
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

function computeDevirtTypeDataAttr(Target, props) {
  const typeName = Target.displayName || Target.name || '';
  const parentTypeName = props[DEVIRT_TYPE_DATA_ATTR];
  const devirtTypeAttr = [typeName, parentTypeName].filter(Boolean).join();
  return { [DEVIRT_TYPE_DATA_ATTR]: devirtTypeAttr };
}

function prefixDataAttrs(data) {
  return data ? Object.assign(
    {},
    ...Object.keys(data).map(
      (key) => ({ [`${DEVIRT_DATA_PREFIX}${key}`]: data[key] }),
    ),
  ) : {};
}
