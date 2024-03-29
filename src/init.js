import { compileToFunction } from './compiler';
import { initState } from './state';
import { mountComponent, callHook } from './lifecycle';
import { mergeOptions } from './utils';

export function initMixins(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    vm.$options = mergeOptions(this.constructor.options, options);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');

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

    mountComponent(vm, el);
  };
}
