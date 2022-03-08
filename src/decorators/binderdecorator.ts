// Decorators
export function Binder(
  _target: Object,
  _methodName: Object,
  desc: PropertyDescriptor
) {
  const newPropDesc: PropertyDescriptor = {
    configurable: true,
    get() {
      const binding = desc.value.bind(this);
      return binding;
    },
  };
  return newPropDesc;
}
