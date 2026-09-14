import type { Directive, DirectiveBinding } from 'vue';

/**
 * 权限指令（模板态 stub：不隐藏元素）
 *
 * - v-auth="path"
 * - v-auth.read="path"
 * - v-auth.write="path"
 */
const auth: Directive = {
  mounted(_el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value) {
      throw new Error(`auth does not have ${binding.value} privilege`);
    }
  }
};

export default auth;
