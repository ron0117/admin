import { localStg } from '@/utils/storage';
import { nestRequest } from '../request/nest';

export type NestPublicAdmin = {
  id: string;
  email: string;
  username: string | null;
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt?: string;
};

type NestAdminSession = {
  user: NestPublicAdmin;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

const USE_AUTH_MOCK = false;

function createMockUser(subject = 'admin'): Api.Auth.UserInfo {
  return {
    boUserId: 'mock-user-1',
    name: subject || 'Admin',
    accountType: import.meta.env.VITE_LOGIN_SUPER_NAME || 'super admin',
    hierarchy: 'admin',
    email: `${subject || 'admin'}@example.com`,
    status: 'active'
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

export const mapNestUserToBoUser = (user: NestPublicAdmin): Api.Auth.UserInfo => {
  const superName = import.meta.env.VITE_LOGIN_SUPER_NAME || 'super admin';
  return {
    boUserId: user.id,
    name: user.username || user.email,
    email: user.email,
    accountType: superName,
    hierarchy: 'admin',
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt || user.createdAt,
    boDepartmentId: ''
  } as Api.Auth.UserInfo;
};

const mapSession = (session: NestAdminSession): Api.Auth.LoginToken => {
  localStg.set('refreshToken', session.refreshToken);
  return {
    token: session.accessToken,
    boUser: mapNestUserToBoUser(session.user),
    privileges: [],
    boRoles: []
  };
};

export function fetchLogin(_loginType: string, subject: string, password: string) {
  if (USE_AUTH_MOCK) {
    return Promise.resolve({
      data: createMockLoginToken(subject),
      error: null
    });
  }

  return nestRequest<NestAdminSession>({
    url: '/admin/auth/login',
    method: 'post',
    data: { email: subject, password },
    skipAuthRefresh: true
  }).then(({ data, error }) => ({
    data: data && !error ? mapSession(data) : ({} as Api.Auth.LoginToken),
    error: error || (data ? null : { code: 'AUTH_FAILED', msg: '登录失败' })
  }));
}

export function fetchGetUserInfo(_boUserID: string) {
  if (USE_AUTH_MOCK) {
    return Promise.resolve({
      data: createMockUser(),
      error: null
    });
  }

  return fetchUserInfoByToken().then(({ data, error }) => ({
    data: data?.boUser ?? null,
    error
  }));
}

export function fetchRefreshToken(refreshToken: string) {
  if (USE_AUTH_MOCK) {
    return Promise.resolve({
      data: { token: `mock-token-${Date.now()}` },
      error: null
    });
  }

  return nestRequest<NestAdminSession>({
    url: '/admin/auth/refresh',
    method: 'post',
    data: { refreshToken },
    skipAuthRefresh: true
  }).then(({ data, error }) => {
    if (data && !error) {
      localStg.set('refreshToken', data.refreshToken);
      return { data: { token: data.accessToken }, error: null };
    }
    return { data: { token: '' }, error };
  });
}

export function fetchLogout() {
  if (USE_AUTH_MOCK) {
    return Promise.resolve({ data: { ok: true as const }, error: null });
  }

  const refreshToken = localStg.get('refreshToken') || '';
  return nestRequest<{ ok: true }>({
    url: '/admin/auth/logout',
    method: 'post',
    data: { refreshToken },
    skipAuthRefresh: true,
    showErrorMsg: false
  });
}

export function fetchCustomBackendError(code: string, msg: string) {
  return Promise.resolve({ data: null, error: { code, msg } });
}

export function fetchUserInfoByToken() {
  if (USE_AUTH_MOCK) {
    const user = (localStg.get('userInfo') as Api.Auth.UserInfo | null) ?? createMockUser();
    return Promise.resolve({
      data: {
        boUser: user,
        privileges: [],
        boRoles: []
      } as Api.Auth.UserPrivilegeInfo,
      error: null
    });
  }

  return nestRequest<{ user: NestPublicAdmin }>({
    url: '/admin/auth/me',
    method: 'get'
  }).then(({ data, error }) => ({
    data:
      data && !error
        ? ({
            boUser: mapNestUserToBoUser(data.user),
            privileges: [],
            boRoles: []
          } as Api.Auth.UserPrivilegeInfo)
        : null,
    error
  }));
}
