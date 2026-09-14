/**
 * @author lifei
 * 功能：全局类型工具或顶层类型（非模块类型）
 */
declare namespace TCommon {
  /**
   * 功能：定义 Json 复杂数据对象
   */
  type Json<K extends keyof any, T = any> = Record<K, T>;

  /**
   * 功能：或 null 类型
   */
  type OrNull<T> = T | null;

  /**
   * 功能：或 string 类型
   */
  type OrStr<T> = T | string;

  /**
   * 功能：或 undefined 类型
   */
  type OrUndef<T> = T | undefined;

  /**
   * 功能：空函数类型
   */
  type VoidFunc = (...args: unknown[]) => void;

  /**
   * 功能：获取枚举的 value 部分的字面量类型
   */
  type EnumVal<T extends Record<string, string | number>> = `${T[keyof T]}`;

  /**
   * 功能：获取枚举的 key 部分的字面量类型
   */
  type EnumKey<T> = keyof T;

  /**
   * 功能：获取子组件数据类型
   */
  type GetProps<T extends import('vue').ComponentPublicInstance> = T['$props'];

  /**
   * 功能：拷贝数据类型
   */
  type Copy<T> = {
    [P in keyof T]: T[P];
  };

  /**
   * 功能：app 应用配置
   */
  type AppConfig = {
    GA_TRACKING_ID: string;
    GOOGLE_CLIENT_ID: string;
    LIFF_ID: string;
    FB_CLIENT_ID: string;
    APPLE_CLIENT_ID: string;
    SUPER8_LIFF_ID: string;
  };

  /**
   * 功能：语言类型
   */
  // type Lang = OrStr<Json<string>> | Json<{ spine: boolean; svg: string; img: string }>;

  /**
   * 功能：设备类型
   */
  type DeviceType = 'mobile' | 'pc';

  /**
   * 功能：设备方向
   */
  type DeviceOrientation = 'landscape' | 'portrait';

  /**
   * 功能：浏览器类型
   */
  type BrowserType = 'Unknown' | 'Safari' | 'Firefox' | 'Internet Explorer' | 'Edge' | 'Chrome';

  /**
   * 功能：item 自定义列表选项
   */
  type SelectItem<T = number> = {
    readonly value: T | string;
    readonly label: string;
    actived?: boolean;
    disabled?: boolean;
    [props: string]: any;
  };

  /**
   * 功能：美化类型，强制展开类型，让 IDE 显示更简洁
   */
  type Prettify<T> = T extends infer U ? U : never;

  /**
   * 功能：获取json对象的 value 部分的字面量类型
   */
  type ValueOf<T> = Prettify<T[keyof T]>;

  /**
   * 功能：获取json对象的 key 部分的字面量类型
   */
  type KeyOf<T> = keyof T;

  /**
   * 安全类型
   */
  type SafeAccess<T, K extends keyof T> = T[K] extends infer R ? R : never;

  /**
   * 分页
   */
  type Page<T> = {
    data: T;
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
}
