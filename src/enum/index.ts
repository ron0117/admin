export enum SetupStoreId {
  App = 'app-store',
  Theme = 'theme-store',
  Auth = 'auth-store',
  Route = 'route-store',
  Tab = 'tab-store',
  Role = 'role-store',
  System = 'system-store',
  Batch = 'batch-store'
}

export enum TableOperateType {
  Add = 'add',
  Edit = 'edit',
  View = 'view'
}

export enum ExportMode {
  /** 前端导出 */
  CLIENT = 'client',
  /** 服务器导出 */
  SERVER = 'server'
}

export * from './batch';

export enum MockApi {}
