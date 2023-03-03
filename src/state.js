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
    const handler = watch[key]; // 字符串 数组 函数
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
  // 字符串  函数
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(key, handler);
}

function initComputed(vm) {
  const computed = vm.$options.computed;
  const watchers = (vm._computedWatchers = {}); // 将计算属性watcher保存到vm上
  for (let key in computed) {
    let userDef = computed[key];

    // 我们需要监控 计算属性中get的变化
    let fn = typeof userDef === 'function' ? userDef : userDef.get;

    // 如果直接new Watcher 默认就会执行fn, 将属性和watcher对应起来
    watchers[key] = new Watcher(vm, fn, { lazy: true });

    defineComputed(vm, key, userDef);
  }
}

function defineComputed(target, key, userDef) {
  // const getter = typeof userDef === 'function' ? userDef : userDef.get;
  const setter = userDef.set || (() => {});
  // 可以通过实例拿到对应的属性
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter
  });
}

// 计算属性根本不会收集依赖 ，只会让自己的依赖属性去收集依赖
function createComputedGetter(key) {
  // 我们需要检测是否要执行这个getter
  return function () {
    const watcher = this._computedWatchers[key]; // 获取到对应属性的watcher
    if (watcher.dirty) {
      // 如果是脏的就去执行 用户传入的函数
      watcher.evaluate(); // 求值后 dirty变为了false ,下次就不求值了
    }
    if (Dep.target) {
      // 计算属性出栈后 还要渲染watcher， 我应该让计算属性watcher里面的属性 也去收集上一层watcher
      watcher.depend();
    }
    return watcher.value; // 最后返回的是watcher上的值
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
