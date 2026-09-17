import type { RouteMeta } from 'vue-router';
import ElegantVueRouter from '@elegant-router/vue/vite';
import type { RouteKey } from '@elegant-router/types';

export function setupElegantRouter() {
  return ElegantVueRouter({
    layouts: {
      base: 'src/layouts/base-layout/index.vue',
      blank: 'src/layouts/blank-layout/index.vue'
    },
    customRoutes: {
      names: [
        'exception_403',
        'exception_404',
        'exception_500',
        'document_project',
        'document_project-link',
        'document_vue',
        'document_vite',
        'document_unocss',
        'document_naive',
        'document_antd',
        'document_element-plus',
        'document_alova'
      ]
    },
    routePathTransformer(routeName, routePath) {
      const key = routeName as RouteKey;

      if (key === 'login') {
        const modules: UnionKey.LoginModule[] = ['pwd-login'];

        const moduleReg = modules.join('|');

        return `/login/:module(${moduleReg})?`;
      }

      return routePath;
    },
    onRouteMetaGen(routeName) {
      const key = routeName as RouteKey;

      const constantRoutes: RouteKey[] = ['login', '403', '404', '500'];

      const meta: Partial<RouteMeta> = {
        title: key,
        i18nKey: `route.${key}` as App.I18n.I18nKey
      };

      if (constantRoutes.includes(key)) {
        meta.constant = true;
      }

      const extras: Record<string, Partial<RouteMeta>> = {
        home: { icon: 'mdi:monitor-dashboard', order: 1 },
        demo: { icon: 'mdi:flask-outline', order: 99, hideInMenu: true },
        manage: { icon: 'mdi:shield-account-outline', order: 2 },
        manage_admin: { icon: 'mdi:account-tie-outline', order: 1 },
        user: { icon: 'mdi:account-group-outline', order: 3 },
        user_list: { icon: 'mdi:account-outline', order: 1 },
        user_role: { icon: 'mdi:account-key-outline', order: 2 }
      };

      Object.assign(meta, extras[key]);

      return meta;
    }
  });
}
