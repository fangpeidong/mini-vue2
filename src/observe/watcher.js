import Dep from './dep';

let id = 0;

class Watcher {
  constructor(vm, fn, options) {
    this.id = id++;
    this.renderWatcher = options; // 渲染watcher
    this.getter = fn;
    this.deps = [];
    this.depsId = new Set();
    this.get();
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
    this.get();
  }
  get() {
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }
  update() {
    queueWatcher(this);
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
