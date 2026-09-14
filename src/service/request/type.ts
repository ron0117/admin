export interface RequestInstanceState {
  /** the promise of refreshing token */
  refreshTokenPromise: Promise<boolean> | null;
  /** the request error message stack */
  errMsgStack: string[];
  /** 用于标记refresh token的函数 */
  refreshTokenFn?: Promise<boolean> | null;
  [key: string]: unknown;
}

/** 简化的错误信息 */
export interface SimplifiedError {
  /** 错误码 */
  code: string;
  /** 错误消息 */
  msg: string;
  /** 后端返回的错误体(非必要使用，请使用msg替代) */
  raw?: unknown;
  /** HTTP状态码 */
  statusCode?: number;
  /** 请求URL */
  url?: string;
  /** 请求方法 */
  method?: string;
}

/** 自定义请求配置 */
export interface CustomRequestConfig {
  /** 是否显示错误消息 */
  showErrorMsg?: boolean;
  /** 是否返回简化的错误信息（默认: true，只返回code、msg等关键信息） */
  simplifyError?: boolean;
  /**
   * 是否在发生错误时直接 throw（默认: false）
   * - 为 true 且 simplifyError true 时：throw `SimplifiedError`（包含 raw）
   * - 为 true 且 simplifyError false 时：throw 原始 AxiosError
   */
  throwOnError?: boolean;
  /** 自定义错误消息映射（错误码 -> 错误消息） */
  // errorMsgMap?: Record<string, string>;
  /** 自定义错误处理函数 */
  onError?: (error: { code: string; msg: string }) => void;
}
