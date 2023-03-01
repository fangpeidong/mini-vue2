import { createElementVNode, createTextVNode } from './vdom';
import Watcher from './observe/watcher';

function patchProps(el, props) {
  for (let key in props) {
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}

function createElm(vnode) {
  const { tag, data, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    patchProps(vnode.el, data);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function patch(oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType;
  if (isRealElement) {
    const elm = oldVNode;
    const parentElm = elm.parentNode;
    const newElm = createElm(vnode);
    parentElm.insertBefore(newElm, elm.nextSibling);
    parentElm.removeChild(elm);

    return newElm;
  } else {
    // diff
  }
}

export function initLifeCycle(Vue) {
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value !== 'object') {
      return value;
    }
    return JSON.stringify(value);
  };
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    vm.$el = patch(el, vnode);
  };
  Vue.prototype._render = function () {
    return this.$options.render.call(this);
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;
  const updateComponent = () => {
    vm._update(vm._render());
  };

  const wacther = new Watcher(vm, updateComponent, true);
  console.log(wacther);
}
