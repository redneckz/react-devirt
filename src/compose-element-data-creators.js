export function composeElementDataCreators(
  createElementData = () => {},
  otherCreateElementData = () => {},
) {
  return (...args) => Object.assign(
    {},
    createElementData(...args),
    otherCreateElementData(...args),
  );
}
