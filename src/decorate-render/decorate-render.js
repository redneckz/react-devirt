import { copyReactStatics } from './copy-react-statics';

export function decorateRender(propsInjector) {
  return (Target) => {
    if (Target.prototype && Target.prototype.render) {
      // Regular component (class)
      const { render } = Target.prototype;
      Target.prototype.render = function devirtualizedRender(...args) {
        return propsInjector(this.props)(render.apply(this, args));
      };
      return Target;
    }
    function Devirtualized(...args) {
      const [props] = args;
      return propsInjector(props)(Target.apply(this, args));
    }
    copyReactStatics(Target, Devirtualized);
    return Devirtualized;
  };
}
