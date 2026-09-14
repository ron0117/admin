declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      boUser: Api.Auth.UserInfo;
      token: string;
      privileges: Api.Auth.Privilege[];
      /** 与 GET /gate/bo/user/me 一致：当前账号绑定的 BO 角色列表 */
      boRoles?: Api.BoRole.PboBoRole[];
    }

    interface Privilege {
      path: string;
      pathType: string;
      permission: string;
    }
    interface UserInfo {
      accountType: string;
      boDepartmentId: string;
      boUserId: string;
      createdAt: string;
      email: string;
      name: string;
      status: string;
      updatedAt: string;
      hierarchy: 'admin' | 'system' | 'proxy' | 'store';
    }
    interface UserPrivilegeInfo {
      boUser: Api.Auth.UserInfo;
      privileges: Api.Auth.Privilege[];
      /** 与登录接口 boRoles 结构一致 */
      boRoles?: Api.BoRole.PboBoRole[];
    }
  }
}
