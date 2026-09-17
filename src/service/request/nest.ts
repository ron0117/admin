import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createFlatRequest } from '@sa/axios';
import { localStg } from '@/utils/storage';
import type { RequestInstanceState } from './type';

type NestErrorBody = {
  code?: string;
  message?: string | string[];
};

type NestRequestConfig = InternalAxiosRequestConfig & {
  skipAuthRefresh?: boolean;
  showErrorMsg?: boolean;
};

const getNestAuthorization = () => {
  const token = localStg.get('token');
  return token ? `Bearer ${token}` : null;
};

const getNestBaseURL = () => {
  const target = import.meta.env.VITE_NEST_BASE_URL || 'http://localhost:3000';
  const useProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
  return useProxy ? '/proxy-nest' : target;
};

const isAuthSessionUrl = (url?: string) => Boolean(url && /\/admin\/auth\/(login|refresh|logout)(?:\?|$)/.test(url));

const nestErrorMessage = (data: unknown) => {
  if (!data || typeof data !== 'object') {
    return '请求失败';
  }
  const body = data as NestErrorBody;
  if (Array.isArray(body.message)) {
    return body.message.join('; ');
  }
  if (typeof body.message === 'string' && body.message) {
    return body.message;
  }
  return '请求失败';
};

let refreshPromise: Promise<boolean> | null = null;

const refreshNestSession = async (): Promise<boolean> => {
  const refreshToken = localStg.get('refreshToken') || '';
  if (!refreshToken) {
    return false;
  }

  const { data, error } = await nestRequest<{
    accessToken: string;
    refreshToken: string;
  }>({
    url: '/admin/auth/refresh',
    method: 'post',
    data: { refreshToken },
    skipAuthRefresh: true,
    showErrorMsg: false
  });

  if (error || !data?.accessToken) {
    return false;
  }

  localStg.set('token', data.accessToken);
  if (data.refreshToken) {
    localStg.set('refreshToken', data.refreshToken);
  }
  return true;
};

const ensureRefreshed = () => {
  if (!refreshPromise) {
    refreshPromise = refreshNestSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const nestClient = createFlatRequest(
  {
    baseURL: getNestBaseURL(),
    validateStatus: status => status < 500
  },
  {
    defaultState: {
      errMsgStack: [],
      refreshTokenPromise: null
    } as RequestInstanceState,
    transform: (response: AxiosResponse) => response.data,
    async onRequest(config) {
      const Authorization = getNestAuthorization();
      if (Authorization) {
        Object.assign(config.headers, { Authorization });
      }
      return config;
    },
    isBackendSuccess(response) {
      return response.status >= 200 && response.status < 300;
    },
    async onBackendFail(response, instance) {
      const cfg = response.config as NestRequestConfig;
      const status = response.status;

      if (status === 401 && !cfg.skipAuthRefresh && !isAuthSessionUrl(cfg.url)) {
        const ok = await ensureRefreshed();
        if (ok) {
          const Authorization = getNestAuthorization();
          Object.assign(response.config.headers, { Authorization });
          return instance.request(response.config) as Promise<AxiosResponse>;
        }
        const { useAuthStore } = await import('@/store/modules/auth');
        useAuthStore().resetStore();
        return null;
      }

      if (cfg.showErrorMsg !== false) {
        window.$message?.error(nestErrorMessage(response.data));
      }
      return null;
    },
    onError(error) {
      const status = error.response?.status;
      if (status && status >= 500) {
        window.$message?.error(nestErrorMessage(error.response?.data) || error.message);
      }
    }
  }
);

export const nestRequest = nestClient as <T = unknown>(config: {
  url: string;
  method?: string;
  data?: unknown;
  params?: unknown;
  skipAuthRefresh?: boolean;
  showErrorMsg?: boolean;
}) => Promise<{ data: T; error: unknown | null }>;
