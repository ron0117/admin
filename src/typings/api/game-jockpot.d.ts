declare namespace Api {
  namespace GameJackpot {
    interface GameJackpotHistoryReq {
      /** 玩家账号 */
      userAccount?: string;
      /** 玩家id */
      userId?: 0;
      /** 玩家昵称 */
      userName?: string;
      /** 玩家手机号 +86xxxx */
      userPhone?: string;
      createdAtEnd?: string;
      createdAtStart?: string;
      pageIndex?: number;
      pageSize?: number;
      /** 彩金等级 */
      jackpotLevel?: number;
      proxyId?: string;
      storeId?: string;
    }

    interface jackpotBingoHistory {
      displayId?: number;
      createdAt?: string;
      gameCategory?: string;
      /** 游戏id */
      gameId?: number;
      gameName?: Record<string, string>;
      /** 彩金组 */
      jackpotGroup?: number;
      /** 彩金层级 */
      jackpotLevel?: number;
      machineNumber?: number;
      /** 店家名称 */
      storeName?: string;
      /** 开启JP押注 */
      minBet?: number;
      /** 代理id */
      proxyId?: string;
      /** 店家id */
      storeId?: string;
      userId?: number;
      userName?: string;
      /** 彩金值 */
      values?: number;
      /** 押注id */
      wagerId?: string;
    }

    interface GameJackpotHistoryResp {
      results?: jackpotBingoHistory[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    }

    interface jackpotBingoHistoryExportResp {
      results?: jackpotBingoHistory[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    }

    interface jackpotBingoHistoryExportReq {
      createdAtEnd?: string;
      createdAtStart?: string;
      /** 彩金等级 */
      jackpotLevel?: number;
      proxyId?: string;
      storeId?: string;
    }

    /** 店家接口 */
    interface PboBoUserStoreListItem {
      boUserId?: string;
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
    }

    interface PboBoUserStoreListResp {
      /** 用户列表 */
      items?: PboBoUserStoreListItem[];
    }
  }
}
