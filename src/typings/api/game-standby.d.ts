/**
 * 游戏设置 - 待机页广告（与 zjh `PadminStandby*` 对齐）
 * 路径前缀：`/game/settings/standby`
 */
declare namespace Api.GameStandby {
  /** 1-未上架 2-上架中 3-已逾期 4-已下架 */
  type StandbyStatus = 1 | 2 | 3 | 4;

  type StandbyImage = Record<GlobalLangType, string | CommonType.I18nResourceConfig>;

  type StandbyMeta = {
    image?: StandbyImage;
    [key: string]: unknown;
  };

  type StandbyDTO = {
    id?: number;
    name?: Record<GlobalLangType, string>;
    startAt?: string;
    endAt?: string;
    sort?: number;
    status?: StandbyStatus;
    /** 列表展示用状态（优先于 status 展示） */
    displayStatus?: StandbyStatus;
    meta?: StandbyMeta;
    createdAt?: string;
    updatedAt?: string;
    lastUpdated?: string;
  };

  type StandbyListReq = {
    startAt?: string;
    endAt?: string;
    name?: string;
    status?: StandbyStatus;
  };

  type StandbyListResp = {
    items?: StandbyDTO[];
  };

  type StandbyDetailResp = {
    item?: StandbyDTO;
  };

  type StandbyCreateReq = {
    name: Record<GlobalLangType, string>;
    startAt?: string;
    endAt?: string;
    sort?: number;
    status?: StandbyStatus;
    meta?: StandbyMeta;
  };

  type StandbyCreateResp = {
    id?: number;
  };

  type StandbyUpdateReq = {
    id: number;
    name: Record<GlobalLangType, string>;
    startAt?: string;
    endAt?: string;
    sort?: number;
    status?: StandbyStatus;
    meta?: StandbyMeta;
  };

  type StandbyOfflineReq = {
    id: number;
  };
}
