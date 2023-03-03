import { initGlobalAPI } from './globalApi';
import { initMixins } from './init';
import { initLifeCycle } from './lifecycle';
import Watcher, { nextTick } from './observe/watcher';

function Vue(options) {
  this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initMixins(Vue);
initLifeCycle(Vue);
initGlobalAPI(Vue);

// 最终调用的都是这个方法
Vue.prototype.$watch = function (exprOrFn, cb) {
  new Watcher(this, exprOrFn, { user: true }, cb);
};

export default Vue;
