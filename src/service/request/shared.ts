import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';
import { localStg } from '@/utils/storage';
import { error_message_cn, error_message_tw, error_message_us } from '@/locales/langs/error-message';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/** refresh token */
async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const rToken = localStg.get('refreshToken') || '';
  const { error, data } = await fetchRefreshToken(rToken);
  if (!error) {
    localStg.set('token', data.token);
    // localStg.set('refreshToken', data.refreshToken);
    return true;
  }

  resetStore();

  return false;
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenFn) {
    state.refreshTokenFn = handleRefreshToken();
  }

  const success = await state.refreshTokenFn;

  setTimeout(() => {
    state.refreshTokenFn = null;
  }, 1000);

  return success;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error({
      message,
      onClose: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}

/**
 * 根据错误码获取错误消息
 * @param code 错误码
 * @param defaultMsg 默认消息
 * @param errorMsgMap 自定义错误消息映射
 */
export function getErrorMsgByCode(code: string, defaultMsg: string): string;
export function getErrorMsgByCode(code: number, defaultMsg: string): string;
export function getErrorMsgByCode(code: string | number, defaultMsg: string): string {
  const appStore = useAppStore();
  // 兼容 locale 可能是 ref / 也可能是普通值的情况
  const locale = ((appStore as any).locale?.value ?? (appStore as any).locale) as App.I18n.LangType;
  const errorMsgMap: Record<App.I18n.LangType, App.I18n.Schema['errorMessage']> = {
    'en-us': error_message_us,
    'zh-cn': error_message_cn,
    'zh-tw': error_message_tw
  };

  // `App.I18n.Schema['errorMessage']` 可能是精确键对象类型（无 string 索引签名），这里收敛成可索引的字典类型
  const dict = (errorMsgMap[locale] || {}) as Record<string, string>;
  return dict[String(code)] || defaultMsg;
}

/**
 * 简化错误对象，只保留关键信息
 * @param error AxiosError对象
 */
export function simplifyError(error: any) {
  const code = String(error.response?.data?.code || error.code || 'UNKNOWN');
  const defaultMsg = error.response?.data?.message || error.message || '请求失败';
  const msg = getErrorMsgByCode(code, defaultMsg);

  return {
    code,
    msg,
    raw: error.response?.data,
    statusCode: error.response?.status,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase()
  };
}
