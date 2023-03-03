import { initGlobalAPI } from './globalApi';
import { initMixins } from './init';
import { initLifeCycle } from './lifecycle';
import { nextTick } from './observe/watcher';

function Vue(options) {
  this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initMixins(Vue);
initLifeCycle(Vue);
initGlobalAPI(Vue);

export default Vue;
