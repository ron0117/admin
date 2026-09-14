import { $t as t } from '@/locales';

export enum PermissionEnum {
  edit = 'edit',
  delete = 'delete',
  down = 'down',
  active = 'active',
  inactive = 'inactive',
  view = 'view',
  copy = 'copy',
  hide = 'hide',
  export = 'export',
  reInit = 'reInit',
  detail = 'detail',
  pickDetail = 'pickDetail',
  disable = 'disable',
  history = 'history',
  revocation = 'revocation',
  remove = 'remove',
  financeApprove = 'pending:finance:approve',
  pendingApprove = 'pending:approve',
  couponIdQuery = 'store:coupon_id:query',
  write = 'write',
  none = 'none'
}

export type PermissionEvent =
  | 'onEdit'
  | 'onDel'
  | 'onView'
  | 'onActive'
  | 'onInactive'
  | 'onCopy'
  | 'onDetail'
  | 'onRemove';

type TPermissionItem = {
  value: PermissionEnum;
  name: string;
  event: PermissionEvent;
};

export const PermissionListEnum: TPermissionItem[] = [
  {
    value: PermissionEnum.edit,
    name: t('common.edit'),
    event: 'onEdit'
  },
  {
    value: PermissionEnum.delete,
    name: t('common.delete'),
    event: 'onDel'
  },
  {
    value: PermissionEnum.view,
    name: t('common.view'),
    event: 'onView'
  },
  {
    value: PermissionEnum.active,
    name: t('common.enable'),
    event: 'onActive'
  },
  {
    value: PermissionEnum.inactive,
    name: t('common.disable'),
    event: 'onInactive'
  },
  {
    value: PermissionEnum.copy,
    name: t('common.copy'),
    event: 'onCopy'
  },
  {
    value: PermissionEnum.detail,
    name: t('common.detail'),
    event: 'onDetail'
  },
  {
    value: PermissionEnum.remove,
    name: t('common.remove'),
    event: 'onRemove'
  }
];
