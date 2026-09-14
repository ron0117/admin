import { localStg } from '@/utils/storage';
import { request } from '../request';

const USE_AUTH_MOCK = import.meta.env.VITE_AUTH_MOCK !== 'N';

function createMockUser(subject = 'admin'): Api.Auth.UserInfo {
  return {
    boUserId: 'mock-user-1',
    name: subject || 'Admin',
    accountType: import.meta.env.VITE_LOGIN_SUPER_NAME || 'super admin',
    hierarchy: 'admin'
  } as Api.Auth.UserInfo;
}

function createMockLoginToken(subject: string): Api.Auth.LoginToken {
  return {
    token: `mock-token-${Date.now()}`,
    boUser: createMockUser(subject),
    privileges: [],
    boRoles: []
  } as Api.Auth.LoginToken;
}

/**
 * Login
 */
export function fetchLogin(loginType: string, subject: string, password: string) {
  if (USE_AUTH_MOCK) {
    return Promise.resolve({
      data: createMockLoginToken(subject),
      error: null,
      response: null
    }) as ReturnType<typeof request<Api.Auth.LoginToken>>;
  }

  return request<Api.Auth.LoginToken>({
    url: '/public/bo/auth/login',
    method: 'post',
    data: {
      loginType,
      subject,
      password
    }
  });
}

/** Get user info */
export function fetchGetUserInfo(boUserID: string) {
  if (USE_AUTH_MOCK) {
    return Promise.resolve({
      data: createMockUser(),
      error: null,
      response: null
    }) as ReturnType<typeof request<Api.Auth.UserInfo>>;
  }

  return request<Api.Auth.UserInfo>({
    url: `/bo/user/detail?boUserID=${boUserID}`,
    method: 'GET'
  });
}

/**
 * Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  if (USE_AUTH_MOCK) {
    return Promise.resolve({
      data: { token: `mock-token-${Date.now()}` },
      error: null,
      response: null
    }) as ReturnType<typeof request<Api.Common.RecordResponse>>;
  }

  return request<Api.Common.RecordResponse>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}

/**
 * 获取用户权限信息根据token
 */
export function fetchUserInfoByToken() {
  if (USE_AUTH_MOCK) {
    const user = (localStg.get('userInfo') as Api.Auth.UserInfo | null) ?? createMockUser();
    return Promise.resolve({
      data: {
        boUser: user,
        privileges: [],
        boRoles: []
      } as Api.Auth.UserPrivilegeInfo,
      error: null,
      response: null
    }) as ReturnType<typeof request<Api.Auth.UserPrivilegeInfo>>;
  }

  return request<Api.Auth.UserPrivilegeInfo>({
    url: '/gate/bo/user/me',
    method: 'GET'
  });
}
