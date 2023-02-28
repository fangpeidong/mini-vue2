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

export default Dep;
