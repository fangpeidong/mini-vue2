import { compileToFunction } from './compiler';
import { initState } from './state';

export function initMixins(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    initState(vm);
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const opts = vm.$options;
    el = document.querySelector(el);
    vm.$el = el;
    if (!opts.render) {
      let template = opts.template;
      if (!template) {
        template = el.outerHTML;
      }
      let render = compileToFunction(template);
      opts.render = render;
    }
  };
}
