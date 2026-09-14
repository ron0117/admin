declare namespace Api {
  namespace SystemMaintain {
    interface TesterListReq {
      pageIndex: number;
      pageSize: number;
    }

    interface DtoUserGetResp {
      /** 玩家账号 */
      account?: string;
      /** 玩家头像 */
      avatar?: string;
      /** 客户端类型 */
      clientType?: string;
      /** 信用点数 */
      credit?: number;
      /** 是否是主账号 */
      isMaster?: boolean;
      /** 玩家当前等级 */
      level?: number;
      /** 备用，玩家昵称 */
      name?: string;
      /** 国码+玩家手机号 */
      phone?: string;
      /** 玩家手机号 */
      phoneNumber?: string;
      /** 玩家账号 */
      subject?: string;
      /** 设备udid */
      udid?: string;
      /** 玩家ID */
      userId?: number;
      /** 店家 */
      userStore?: string;
      /** 玩家当前VIP */
      vip?: number;
    }

    interface PadminTester {
      comment?: string;
      createdAt?: string;
      testerId?: number;
      udid?: string;
    }

    interface PadminTesterListResp {
      members?: PadminTester[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    }
  }
}
