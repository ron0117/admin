declare namespace Api {
  namespace BoBound {
    type PboBoBoundBatchBindReq = {
      /** 用户ID列表 */
      boUserIds: string[];
      /** 父用户ID */
      parentUserId: string;
      /** 备注 */
      remark?: string;
    };

    type PboBoBoundBatchBindResp = object;

    type PboBoBoundBatchReleaseReq = {
      /** 父用户ID */
      parentUserId: string;
    };

    type PboBoBoundBatchReleaseResp = object;

    type PboBoBoundBindReq = {
      /** 用户ID */
      boUserId: string;
      /** 父用户ID */
      parentUserId: string;
      /** 备注 */
      remark?: string;
    };

    type PboBoBoundBindResp = object;

    type PboBoBoundReleaseReq = {
      /** 用户ID */
      boUserId: string;
    };

    type PboBoBoundReleaseResp = object;

    type PboBoUserProxySearchReq = {
      boUserId?: string;
      status?: string;
    };

    /**  */
    type PboBoBoundDTO = {
      boUserId: string;
      /** 绑定时间 */
      boundAt?: string;
      /** 层级 */
      hierarchy?: string;
      /** 用户名称 */
      name?: string;
      /** 备注 */
      remark?: string;
      /** 状态 */
      status?: string;
      /** 是否有子节点 */
      hasChildren?: boolean;
      /** 显示ID */
      displayId?: number;
    };

    type PboBoUserProxySearchResp = {
      /** 用户列表 */
      items: PboBoBoundDTO[];
      pageIndex: number;
      pageSize: number;
      totalCount: number;
    };

    /** 店家接口 */
    type PboBoUserStoreListItem = {
      /** 店家ID */
      displayId?: string;
      /** 店家ID */
      boUserId?: string;
      /** lsid */
      lsid?: number;
      /** 绑定时间 */
      boundAt?: string;
      /** 层级 */
      hierarchy?: string;
      /** 用户名称 */
      name?: string;
      /** 备注 */
      remark?: string;
      /** 状态（store时为unbound，其他为空） */
      status?: string;
      /** 如果是店家显示对应代理商ID， 如果不是或没有则为空 */
      parentUserId?: string;
      /** 如果是店家显示对应代理商名称， 如果不是或没有则为空 */
      parentName?: string;
      meta?: {
        /** ATG單機版押注群组 */
        atgOfflineBetGroup?: number;
        /** ATG彩金版押注群组 */
        atgOnlineBetGroup?: number;
        /** 單機版押注群组 */
        offlineBetGroup?: number;
        /** 彩金版押注群组 */
        onlineBetGroup?: number;
        /** 待机页设定 */
        standby?: {
          /** 是否顺序轮播 */
          carousel?: boolean;
          /** 是否启用 */
          enabled?: boolean;
        };
      };
    };

    type PboBoUserStoreListResp = {
      /** 用户列表 */
      items?: PboBoUserStoreListItem[];
    };

    /** 展开接口 */
    type PboBoUserBoundListReq = {
      /** parentUserId */
      parentUserId: string;
      /** boUserId */
      boUserId?: string;
    };

    type PboBoUserBoundListResp = {
      /** 绑定列表 */
      items?: PboBoBoundDTO[];
    };

    type PboBoUserStoreListReq = {
      name?: string;
    };
  }
}
