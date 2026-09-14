import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    /** 用于传递自定义数据的metadata字段 */
    metadata?: Record<string, any>;
  }
}
