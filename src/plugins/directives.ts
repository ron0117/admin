import type { App } from 'vue';
import auth from '@/directives/auth';
import hie from '@/directives/hie';
/**
 * 设置Vue应用的自定义指令
 * @param app Vue应用实例
 */
export const setupDirectives = (app: App) => {
  // 注册名为'auth'的自定义指令，传入auth指令定义对象
  app.directive('auth', auth);
  // 注册名为'hie'的自定义指令
  app.directive('hie', hie);
};
