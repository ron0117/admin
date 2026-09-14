export {};

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import('nprogress').NProgress;
    /** MessageBox instance */
    $messageBox?: import('element-plus').IElMessageBox;
    /** Message instance */
    $message?: import('element-plus').Message;
    /** Notification instance */
    $notification?: import('element-plus').Notify;
    /** 全局批量任务入口 */
    $batch?: import('@/store/modules/batch/shared').WindowBatch;
  }

  /** Build time of the project */
  export const BUILD_TIME: string;
}
