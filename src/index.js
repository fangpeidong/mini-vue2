import { initMixins } from './init';
import { initLifeCycle } from './lifecycle';

function Vue(options) {
  this._init(options);
}

initMixins(Vue);
initLifeCycle(Vue);

export default Vue;
