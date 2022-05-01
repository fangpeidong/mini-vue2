import { initMixins } from './init';

function Vue(options) {
  this._init(options);
}

initMixins(Vue);

export default Vue;
