import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { fetchLogin, fetchUserInfoByToken } from '@/service/api';
import { useSystemStore } from '@/store/modules/system';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getBoRoles, getPrivileges, getToken, getUserInfo } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());
  const userInfo = reactive<Api.Auth.UserInfo>(getUserInfo());
  const privileges = reactive<Api.Auth.Privilege[]>(getPrivileges());
  const privilegepaths = reactive<string[]>([]);
  const boRoles = ref<Api.BoRole.PboBoRole[]>(getBoRoles());

  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    if (VITE_AUTH_ROUTE_MODE === 'static' && VITE_STATIC_SUPER_ROLE === 'Y') {
      return true;
    }

    const isUserSuper = isLogin.value && userInfo.accountType === import.meta.env.VITE_LOGIN_SUPER_NAME;
    if (isUserSuper) {
      return true;
    }

    return false;
  });

  const isLogin = computed(() => Boolean(token.value));

  async function resetStore() {
    recordUserId();
    clearAuthStorage();
    token.value = '';
    const emptyUserInfo = getUserInfo();
    Object.keys(userInfo).forEach(key => {
      (userInfo as Record<string, unknown>)[key] = undefined;
    });
    Object.assign(userInfo, emptyUserInfo);
    privileges.splice(0, privileges.length);
    privilegepaths.splice(0, privilegepaths.length);
    boRoles.value = [];

    if (!route.meta.constant) {
      await toLogin();
    }
    tabStore.cacheTabs();
    routeStore.resetStore();
    useSystemStore().resetBoUserRelationCaches();
  }

  function recordUserId() {
    if (!userInfo.boUserId) {
      return;
    }
    localStg.set('lastLoginUserId', userInfo.boUserId);
  }

  function checkTabClear(): boolean {
    if (!userInfo.boUserId) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    if (lastLoginUserId !== userInfo.boUserId) {
      localStg.remove('globalTabs');
      tabStore.clearTabs();
      return true;
    }

    return false;
  }

  async function login({
    loginType,
    subject,
    password,
    redirect = true
  }: {
    loginType: string;
    subject: string;
    password: string;
    redirect?: boolean;
  }) {
    startLoading();

    const { data: loginToken, error } = await fetchLogin(loginType, subject, password);
    if (!error && loginToken) {
      localStg.set('token', loginToken.token);
      token.value = loginToken.token;

      fleshUserInfoAbout(loginToken.boUser, loginToken.privileges, loginToken.boRoles);

      const isClear = checkTabClear();
      let needRedirect = redirect;
      if (isClear) {
        needRedirect = false;
      }
      await redirectFromLogin(needRedirect);

      window.$notification?.success({
        title: $t('page.login.common.loginSuccess'),
        message: $t('page.login.common.welcomeBack', { userName: loginToken.boUser.name }),
        duration: 4500
      });
    } else {
      resetStore();
    }

    endLoading();
  }

  function fleshUserInfoAbout(
    boUserInfo: Api.Auth.UserInfo,
    privilegesInfo: Api.Auth.Privilege[],
    boRolesInfo?: Api.BoRole.PboBoRole[]
  ) {
    localStg.set('userInfo', boUserInfo);
    Object.assign(userInfo, boUserInfo);
    if (privilegesInfo && privilegesInfo.length > 0) {
      localStg.set('privileges', privilegesInfo);
      privileges.splice(0, privileges.length, ...privilegesInfo);
      privilegepaths.splice(0, privilegepaths.length, ...privilegesInfo.map(item => item.path));
    }
    const nextBoRoles = boRolesInfo ?? [];
    localStg.set('boRoles', nextBoRoles);
    boRoles.value = [...nextBoRoles];
  }

  async function initUserInfo() {
    const hasToken = getToken();
    if (!hasToken) {
      return;
    }

    const { data, error } = await fetchUserInfoByToken();

    if (error) {
      await resetStore();
      return;
    }

    if (!data?.boUser) {
      await resetStore();
      return;
    }

    fleshUserInfoAbout(data.boUser, data.privileges ?? [], data.boRoles);
  }

  function setPrivilegepaths(data: string[]) {
    privilegepaths.splice(0, privilegepaths.length, ...data);
  }

  /** 模板态：恒 true */
  const hasAuth = (_value?: string) => true;

  return {
    token,
    userInfo,
    privileges,
    privilegepaths,
    boRoles,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo,
    setPrivilegepaths,
    hasAuth
  };
});
