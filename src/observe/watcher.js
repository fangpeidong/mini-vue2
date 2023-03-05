import { pushTarget, popTarget } from './dep';

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, options, cb) {
    this.id = id++;
    this.renderWatcher = options;
    if (typeof exprOrFn === 'string') {
      this.getter = function () {
        return vm[exprOrFn];
      };
    } else {
      this.getter = exprOrFn;
    }
    this.deps = [];
    this.depsId = new Set();
    this.lazy = options.lazy;
    this.cb = cb;
    this.dirty = this.lazy;
    this.vm = vm;
    this.user = options.user;

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
    let oldValue = this.value;
    let newValue = this.get();
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
  get() {
    pushTarget(this);
    let value = this.getter.call(this.vm);
    popTarget();
    return value;
  }
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }
  evaluate() {
    this.value = this.get();
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
