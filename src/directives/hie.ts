import type { Directive, DirectiveBinding } from 'vue';

/**
 * 层级指令（模板态 stub：不隐藏元素）
 * @example v-hie="proxy"
 */
const hie: Directive = {
  mounted(_el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value) {
      throw new Error(`hie does not have ${binding.value} privilege`);
    }
  }
};

export default hie;
