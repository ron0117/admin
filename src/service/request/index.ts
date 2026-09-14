import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { getMockData } from './mock-handlers';
import { getAuthorization, getErrorMsgByCode, handleExpiredRequest, showErrorMsg, simplifyError } from './shared';
import type { CustomRequestConfig, RequestInstanceState, SimplifiedError } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

/** 获取自定义配置（兼容两种方式：config.customConfig 和 config.metadata.customConfig） */
function getCustomConfig(config: any): CustomRequestConfig | undefined {
  return config.customConfig || config.metadata?.customConfig;
}

const baseRequest = createFlatRequest(
  {
    baseURL
    // headers: {
    //   apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    // }
  },
  {
    defaultState: {
      errMsgStack: [],
      refreshTokenPromise: null
    } as RequestInstanceState,
    transform(response: AxiosResponse<App.Service.Response<any>>) {
      return response.data.data;
    },
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async onBackendFail(response, instance) {
      const authStore = useAuthStore();
      const responseCode = String(response.data.code);
      const customConfig = getCustomConfig(response.config);

      // 标记是否已经显示过错误消息（避免在onError中重复显示）
      let errorMsgShown = false;

      function handleLogout() {
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);

        baseRequest.state.errMsgStack = baseRequest.state.errMsgStack.filter(msg => msg !== response.data.status);
      }

      // when the backend response code is in `logoutCodes`, it means the user will be logged out and redirected to login page
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        // 标记已显示错误（登出时不需要显示错误消息）
        response.config.metadata = { ...response.config.metadata, errorMsgShown: true };
        return null;
      }

      // when the backend response code is in `modalLogoutCodes`, it means the user will be logged out by displaying a modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !baseRequest.state.errMsgStack?.includes(response.data.status)) {
        baseRequest.state.errMsgStack = [...(baseRequest.state.errMsgStack || []), response.data.status];

        // prevent the user from refreshing the page
        window.addEventListener('beforeunload', handleLogout);

        const errorMsg = getErrorMsgByCode(responseCode, response.data.status);

        const cleanupModalStateOnly = () => {
          window.removeEventListener('beforeunload', handleLogout);
          baseRequest.state.errMsgStack = baseRequest.state.errMsgStack.filter(msg => msg !== response.data.status);
        };

        window.$messageBox
          ?.confirm(errorMsg, $t('common.error'), {
            confirmButtonText: $t('common.confirm'),
            cancelButtonText: $t('common.cancel'),
            type: 'error',
            closeOnClickModal: false,
            closeOnPressEscape: false
          })
          .then(() => {
            logoutAndCleanup();
          })
          .catch(() => {
            cleanupModalStateOnly();
          });

        errorMsgShown = true;
        response.config.metadata = { ...response.config.metadata, errorMsgShown: true };
        return null;
      }

      // when the backend response code is in `expiredTokenCodes`, it means the token is expired, and refresh token
      // the api `refreshToken` can not return error code in `expiredTokenCodes`, otherwise it will be a dead loop, should return `logoutCodes` or `modalLogoutCodes`
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(baseRequest.state);
        if (success) {
          const Authorization = getAuthorization();
          Object.assign(response.config.headers, { Authorization });

          return instance.request(response.config) as Promise<AxiosResponse>;
        }
        // token刷新失败时不显示错误消息（会跳转到登录页）
        response.config.metadata = { ...response.config.metadata, errorMsgShown: true };
      }

      // 如果配置了自定义错误处理函数，调用它
      if (customConfig?.onError) {
        const errorMsg = getErrorMsgByCode(responseCode, response.data.status);
        customConfig.onError({ code: responseCode, msg: errorMsg });
        errorMsgShown = true;
        response.config.metadata = { ...response.config.metadata, errorMsgShown: true };
      }

      // 标记错误消息显示状态到response.config中，供onError使用
      if (!errorMsgShown) {
        response.config.metadata = { ...response.config.metadata, errorMsgShown: false };
      }

      return null;
    },
    onError(error) {
      console.error('onError', error);
      // when the request is fail, you can show error message

      let message = error.message;
      let backendErrorCode = '';

      // 获取自定义配置
      const customConfig = getCustomConfig(error.config);
      // 检查是否已经在onBackendFail中显示过错误消息
      const errorMsgShown = error.config?.metadata?.errorMsgShown === true;

      // get backend error message and code
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || error.response?.data?.status || message;
        backendErrorCode = String(error.response?.data?.code || '');
      }

      // the error message is displayed in the modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        const authStore = useAuthStore();
        authStore.resetStore();
        return;
      }

      // when the token is expired, refresh token and retry request, so no need to show error message
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      // 如果已经显示过错误消息，不再重复显示
      if (errorMsgShown) {
        return;
      }

      // 如果配置了不显示错误消息，则跳过
      if (customConfig?.showErrorMsg === false) {
        return;
      }

      // 根据自定义错误码映射获取错误消息
      if (backendErrorCode) {
        message = getErrorMsgByCode(backendErrorCode, message);
      }

      showErrorMsg(baseRequest.state, message);
    }
  }
);

/**
 * 包装后的请求函数，自动简化错误对象（默认开启）
 * 支持直接在 config 中传入 customConfig 配置
 */
async function wrappedRequest<T = any>(config: any): Promise<{ data: T | null; error: SimplifiedError | null }> {
  const customConfig = getCustomConfig(config);
  const shouldSimplify = customConfig?.simplifyError !== false; // 默认为 true
  const shouldThrow = customConfig?.throwOnError === true; // 默认为 false

  // 判断是否需要开启mock服务
  const mockData = getMockData(config);
  if (mockData !== null) {
    return { data: mockData as T, error: null };
  }

  const result = await baseRequest<T>(config);

  // 如果没有错误，直接返回
  if (!result.error) {
    return result as { data: T | null; error: null };
  }

  // 如果不需要简化错误，返回原始错误
  if (!shouldSimplify) {
    if (shouldThrow) {
      throw result.error;
    }
    return result as any;
  }

  // 简化错误对象
  const simplifiedErr = simplifyError(result.error);

  if (shouldThrow) {
    throw result.error;
  }

  return {
    data: null,
    error: simplifiedErr
  };
}

/**
 * 统一的请求实例
 *
 * @features
 * - 默认返回简化的错误信息：{ code, msg, statusCode, url, method }
 * - 支持自定义错误码映射、错误处理、控制消息显示
 * - 直接在 config 中配置 customConfig，无需额外函数
 *
 * @example
 * // 基础使用
 * const { data, error } = await request({ url: '/api/game/list', method: 'GET' });
 *
 * // 自定义错误消息
 * const { data, error } = await request({
 *   url: '/api/game/create',
 *   method: 'POST',
 *   data: gameData,
 *   customConfig: {
 *     errorMsgMap: {
 *       '1001': '游戏名称已存在',
 *       '1002': '游戏类别不正确'
 *     }
 *   }
 * });
 *
 * // 自定义错误处理
 * const { data, error } = await request({
 *   url: '/api/game/delete',
 *   method: 'DELETE',
 *   customConfig: {
 *     onError: ({ code, msg }) => {
 *       if (code === '1005') {
 *         window.$messageBox?.confirm(msg, '警告');
 *       }
 *     }
 *   }
 * });
 *
 * // 不显示错误消息
 * const { data, error } = await request({
 *   url: '/api/test',
 *   customConfig: { showErrorMsg: false }
 * });
 *
 * // 获取完整 AxiosError
 * const { data, error } = await request({
 *   url: '/api/debug',
 *   customConfig: { simplifyError: false }
 * });
 */
// export const request = wrappedRequest as typeof baseRequest & {
//   state: RequestInstanceState;
// };
export const request = wrappedRequest as (<T = any>(
  config: any
) => Promise<{ data: T; error: SimplifiedError | null }>) & {
  state: RequestInstanceState;
};

/**
 * 会在发生错误时直接 throw，方便业务层 try/catch 捕获
 *
 * @example
 * try {
 *   const data = await requestThrow<Api.Auth.UserInfo>({ url: '/gate/bo/user/me', method: 'GET' });
 * } catch (e) {
 *   // e 可能是 SimplifiedError（默认）或 AxiosError（customConfig.simplifyError=false）
 *   console.log((e as any).raw); // 后端错误体（如果有）
 * }
 */
export async function requestThrow<T = any>(config: any): Promise<T> {
  const prevCustom = getCustomConfig(config) || {};
  const mergedCustom: CustomRequestConfig = { ...prevCustom, throwOnError: true };

  const { data } = await request<T>({
    ...config,
    customConfig: mergedCustom
  });

  return data as T;
}

// 将 state 挂载到 request 上
request.state = baseRequest.state;

export type { CustomRequestConfig, RequestInstanceState, SimplifiedError };
