import { pushTarget, popTarget } from './dep';

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, options, cb) {
    this.id = id++;
    this.renderWatcher = options; // 是一个渲染watcher
    if (typeof exprOrFn === 'string') {
      this.getter = function () {
        return vm[exprOrFn];
      };
    } else {
      this.getter = exprOrFn; // getter意味着调用这个函数可以发生取值操作
    }
    this.deps = []; // 后续我们实现计算属性，和一些清理工作需要用到
    this.depsId = new Set();
    this.lazy = options.lazy;
    this.cb = cb;
    this.dirty = this.lazy; // 缓存值
    this.vm = vm;
    this.user = options.user; // 标识是否是用户自己的watcher

    this.value = this.lazy ? undefined : this.get();
  }
  addDep(dep) {
    const id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this);
    }
  }
  run() {
    // this.get();
    let oldValue = this.value;
    let newValue = this.get(); // 渲染的时候用的是最新的vm来渲染的
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
  get() {
    pushTarget(this); // 静态属性就是只有一份
    let value = this.getter.call(this.vm); // 会去vm上取值  vm._update(vm._render) 取name 和age
    popTarget(); // 渲染完毕后就清空
    return value;
  }
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend(); // 让计算属性watcher 也收集渲染watcher
    }
  }
  update() {
    if (this.lazy) {
      // 如果是计算属性  依赖的值变化了 就标识计算属性是脏值了
      this.dirty = true;
    } else {
      queueWatcher(this); // 把当前的watcher 暂存起来
    }
  }
  evaluate() {
    this.value = this.get(); // 获取到用户函数的返回值 并且还要标识为脏
    this.dirty = false;
  }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerqueue() {
  const flushqueue = [...queue];
  queue = [];
  has = {};
  pending = false;
  flushqueue.forEach((q) => q.run());
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if (!pending) {
      nextTick(flushSchedulerqueue);
      pending = true;
    }
  }
}

let callbacks = [];
let waiting = false;

function flushCallbacks() {
  let cbs = [...callbacks];
  waiting = false;
  callbacks = [];
  cbs.forEach((cb) => cb());
}

export function nextTick(cb) {
  callbacks.push(cb);
  if (!waiting) {
    Promise.resolve().then(flushCallbacks);
    waiting = true;
  }
}

export default Watcher;
