import { decorateRender } from '../decorate-render';
import { injectPropsIntoElement } from './inject-props-into-element';

const DEVIRT_DATA_PREFIX = 'data-devirt-';
const DEVIRT_TYPE_DATA_ATTR = `${DEVIRT_DATA_PREFIX}type`;

const DEFAULT_ELEMENT_DATA = () => ({});

export function devirtComponent(createElementData = DEFAULT_ELEMENT_DATA) {
  return (Target) => decorateRender(
    (props) => {
      const elementData = createElementData(Target, props);
      const injectedProps = Object.assign(
        ...findoutDataAttrs(props), // Pass through parent data attributes
        prefixDataAttrs(elementData),
        computeDevirtTypeDataAttr(Target, props, elementData),
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

function computeDevirtTypeDataAttr(Target, props, { type }) {
  const typeName = type || Target.displayName || Target.name || '';
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
