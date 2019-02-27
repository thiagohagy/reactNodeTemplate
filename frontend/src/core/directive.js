import Vue from 'vue';
import Store from './../store';

function commentNode(el, vnode) {
  const comment = document.createComment(' ')

  Object.defineProperty(comment, 'setAttribute', {
    value: () => undefined
  })

  vnode.text = ' '
  vnode.elm = comment
  vnode.isComment = true
  vnode.context = undefined
  vnode.tag = undefined
  vnode.data.directives = undefined

  if (vnode.componentInstance) {
    vnode.componentInstance.$el = comment;
  }

  if (el.parentNode) {
    el.parentNode.replaceChild(comment, el)
  }
}

Vue.directive('aclValidator', {

  inserted(el, binding, vnode) {

    const decoded = Store.getters.decoded;
    const modules = decoded.aclModules;
    let show = false;

    for (let im = 0; im < modules.length; im += 1) {
      const myModule = modules[im];
      if (myModule.module === binding.value.module) {
        if (myModule.level <= binding.value.level) show = true;
      }
    }

    if (!show) {
      // se nao tem acesso ou o acesso eh 'pouco', ele esconde o elemento
      commentNode(el, vnode);
    }
  },
});
