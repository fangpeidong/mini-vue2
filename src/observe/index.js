import { isObject, isArray } from '../utils';
import { arrayMethods } from './array';

class Observe {
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false
    });
    if (isArray(value)) {
      value.__proto__ = arrayMethods;
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  observeArray(data) {
    data.forEach((item) => observe(item));
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function defineReactive(obj, key, value) {
  observe(value);
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) {
        return;
      }
      observe(newValue);
      value = newValue;
    }
  });
}

export function observe(value) {
  if (!isObject(value)) {
    return;
  }
  if (value.__ob__) {
    return;
  }
  return new Observe(value);
}
