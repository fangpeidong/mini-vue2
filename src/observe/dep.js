let id = 0;

class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    Dep.target.addDep(this);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
}

Dep.target = null;
let stack = [];
export function pushTarget(watcher) {
  stack.push(watcher);
  Dep.target = watcher;
}
export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}

export default Dep;
