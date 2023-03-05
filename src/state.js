import { observe } from './observe';
import { isFunction } from './utils';
import Watcher from './observe/watcher';
import Dep from './observe/dep';

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  observe(data);
  for (let key in data) {
    proxy(vm, key, '_data');
  }
}

function initWatch(vm) {
  let watch = vm.$options.watch;
  for (let key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, key, handler) {
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(key, handler);
}

function initComputed(vm) {
  const computed = vm.$options.computed;
  const watchers = (vm._computedWatchers = {});
  for (let key in computed) {
    let userDef = computed[key];
    let fn = typeof userDef === 'function' ? userDef : userDef.get;
    watchers[key] = new Watcher(vm, fn, { lazy: true });
    defineComputed(vm, key, userDef);
  }
}

function defineComputed(target, key, userDef) {
  const setter = userDef.set || (() => {});
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter
  });
}

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key];
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}

function proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  });
}
