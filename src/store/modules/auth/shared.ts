import { localStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return localStg.get('token') || '';
}

/** Get userInfo */
export function getUserInfo() {
  return localStg.get('userInfo') || ({} as Api.Auth.UserInfo);
}

export function getPrivileges() {
  return localStg.get('privileges') || [];
}

/** 当前登录账号的 BO 角色列表（与登录、/gate/bo/user/me 一致） */
export function getBoRoles() {
  return localStg.get('boRoles') || [];
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
  localStg.remove('privileges');
  localStg.remove('boRoles');
}
