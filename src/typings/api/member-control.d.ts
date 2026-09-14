declare namespace Api {
  namespace MemberControl {
    // DTO
    type AccountAccountPermissionListDTO = {
      account?: string;
      action?: 'open' | 'close' | 'none';
      boUserID?: string;
      /** 处理人 */
      boUserName?: string;
      createdAt?: string;
      endAt?: string;
      meta?: object;
      name?: string;
      parentAccount?: string;
      parentUID?: 0;
      phone?: string;
      reason?: string;
      type?: string; // 测试只会返回test
      updatedAt?: string;
      userId?: number;
    };

    // list
    type AccountAccountPermissionListReq = {
      account?: string;
      name?: string;
      pageIndex?: number;
      pageSize?: number;
      phone?: string;
      type?: string;
      userId?: number;
    };

    type AccountAccountPermissionListResp = {
      list?: AccountAccountPermissionListDTO[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    };

    // create
    type AccountAddAccountPermissionReq = {
      endTime?: string;
      isChild?: boolean;
      meta?: object;
      reason: string;
      type: string;
      users: number[];
    };

    // delete
    type AccountDeleteAccountPermissionReq = {
      isChild?: boolean;
      type: string;
      userId?: number;
    };
  }
}
