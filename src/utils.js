export function isFunction(val) {
  return typeof val == 'function';
}

export function isObject(val) {
  return typeof val == 'object' && val !== null;
}

export function isArray(val) {
  return Array.isArray(val);
}
