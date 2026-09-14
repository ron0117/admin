// import type { EnumBoRoleStatus, EnumPathType, EnumPermission } from '@/enum/role';
declare namespace Api {
  namespace BoRole {
    export interface PboBoRoleListReq {
      name?: string;
      sort?: string;
      status?: string;
    }

    export interface PboBoRoleListResp {
      /** 角色列表 */
      boRoles?: PboBoRole[];
    }

    enum PrivilegePathType {
      // 编辑权限
      WRITE = 3,
      // 查看权限
      READ = 2,
      // 无权限
      NONE = 1,
      // 其他
      OTHER = 0
    }

    export interface PboBoRoleCreateReq {
      /** 名称 */
      name: string;
      /** 权限列表 */
      privileges?: PboBoRolePrivilege[];
      /** 描述 */
      summary?: string;
    }

    interface PboBoRole {
      /** 角色ID */
      boRoleId?: string;
      createdAt?: string;
      /** 名称 */
      name: string;
      /** 状态 */
      status?: 'active' | 'inactive';
      /** 描述 */
      summary: string;
      updatedAt?: string;
    }

    /** 权限树的结构定义 */
    interface PboBoRolePrivilege {
      /** 路径 */
      path: string;
      /** 路径类型 */
      pathType: 'menu' | 'btn';
      /** 权限 */
      permission?:
        | 'none'
        | 'gate'
        | 'read'
        | 'write'
        | 'pending:approve'
        | 'pending:reject'
        | 'pending:finance:approve'
        | 'pending:finance:reject'
        | 'pending:activity:approve'
        | 'pending:activity:reject'
        | 'permission:delete:member'
        | 'permission:delete:mail'
        | 'permission:delete:phone'
        | 'permission:delete:line'
        | 'permission:update:user_control'
        | 'permission:unlock:ban_detail'
        | 'permission:change:laobi'
        | 'permission:send:item'
        | 'permission:bind:account'
        | 'permission:update:phone'
        | 'permission:update:service_note'
        | 'permission:update:nickname'
        | 'permission:update:summary'
        | 'permission:update:lock_credit'
        | 'permission:update:wallet_reset'
        | 'permission:update:recover_account'
        | 'permission:reset:password'
        | 'permission:create:test_account';
    }

    interface PboBoRoleDetailResp {
      /** 角色ID */
      boRoleId: string;
      createdAt?: string;
      /** 名称 */
      name: string;
      /** 权限列表 */
      privileges: PboBoRolePrivilege[];
      /** 状态 */
      status: 'active' | 'inactive';
      /** 描述 */
      summary: string;
      updatedAt?: string;
    }

    interface PrivilegesTreeNode extends PboBoRolePrivilege {
      /** 节点名称 */
      label: string;
      /** 是否是叶子节点（针对权限树组件来说） */
      isleafNodes?: boolean;
      /** 按钮是否选择的类型 */
      checked?: boolean;
      noteIcon?: PrivilegePathType;
      noteIconType?: PrivilegePathType;
      /** 子目录权限 */
      children?: PrivilegesTreeNode[];
      buttons?: PrivilegesTreeNode[];
    }

    interface PboBoRoleListReq {
      name?: string;
      sort?: string;
      status?: string;
    }
  }
}
