declare namespace Api.AnnounceStandby {
  type StandbyStoreConfig = {
    /** 是否启用待机页 */
    enabled?: boolean;
    /** 是否顺序轮播 */
    carousel?: boolean;
  };

  type StandbyStoreSaveItem = {
    /** 店家用户 ID */
    boUserId: string;
    /** 是否启用待机页 */
    enabled?: boolean;
    /** 是否顺序轮播 */
    carousel?: boolean;
  };

  type StandbyStoreSaveReq = {
    items: StandbyStoreSaveItem[];
  };

  type StandbyStoreSaveResp = object;
}
