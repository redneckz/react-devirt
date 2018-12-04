import { toRegularComponent } from './to-regular-component';

export function decorateRender(decorator) {
  return (Target) => {
    const RegularTarget = toRegularComponent(Target);
    // eslint-disable-next-line no-param-reassign
    RegularTarget.prototype.render = decorator(RegularTarget.prototype.render);
    return RegularTarget;
  };
}
