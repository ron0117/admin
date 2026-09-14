declare namespace Api {
  type GlobalLangType = import('@/locales').GlobalLangType;
  /**
   * namespace GameManage
   *
   * backend api module: "GameManage"
   */
  namespace GameManage {
    type GameCommonSearchParams = Pick<Common.PaginatingCommonParams, 'pageIndex' | 'pageSize'>;

    /** game */
    type Game = Common.CommonRecord<{
      /** game name */
      category: string;
      gameId: number | null;
      gameIcon: {
        iconSmall: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
        iconBig: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
      };
      machine?: {
        [key: string]: {
          [key: string]: { startNo: number; amount: number };
        };
      };
      maintain?: string;
      gameType: string;
      /** 扩展配置；ATG 厂商时含 meta.atg.providerId（游戏供应厂商 ID，服务端为 int） */
      meta: object;
      /** 游戏厂牌 id（P0 契约；列表接口可带 brandName 便于展示） */
      brandId?: number | null;
      name: Record<GlobalLangType, string>;
      provider: string;
      providerGameId: string;
      subProvider: string;
      web: boolean;
    }>;

    type ImportGameParams = {
      games: Game[];
    };

    /** game search params */
    type GameSearchParams = CommonType.RecordNullable<
      Pick<Game, 'category' | 'gameId' | 'brandId'> & GameCommonSearchParams
    >;

    type GameList = Pick<
      Game,
      | 'category'
      | 'id'
      | 'name'
      | 'gameId'
      | 'meta'
      | 'provider'
      | 'providerGameId'
      | 'subProvider'
      | 'gameIcon'
      | 'brandId'
    >;

    type Machine = {
      machineType: GameType.MachineCardType;
      gameId: number | null;

      id: number;
      machineId: number;
      name: string;
      status: GameType.MachineStatusType;
      ttl?: number;
      userId?: number;
      group: number;
      web: boolean;
    };

    type MachineSearchParams = CommonType.RecordNullable<
      Pick<Machine, 'machineType' | 'status' | 'gameId' | 'group'> & GameCommonSearchParams
    >;

    type MachineList = Pick<Machine, 'status' | 'machineId' | 'id' | 'name' | 'userId' | 'ttl'>;

    type KickOutGameParams = Pick<Machine, 'machineId' | 'gameId' | 'group' | 'userId'>;

    type CreateGameParams = Pick<
      Game,
      | 'category'
      | 'name'
      | 'gameIcon'
      | 'meta'
      | 'provider'
      | 'providerGameId'
      | 'subProvider'
      | 'web'
      | 'gameId'
      | 'brandId'
    >;

    type UpdateGameParams = CreateGameParams & {
      gameId: number;
    };

    // 设定参数
    type GameSetParams = {
      gameId: number | null | undefined;
      group: number | undefined;
      pointRatio: string;
      probability: number | null;
      probabilityOptions: number[];
      featureList: {
        name: string;
        count: string;
        enable: boolean;
        rtp: number | null;
        rtpList: number[] | null;
        mode: string;
        addOn?: Record<string, number[]> | null;
        star?: number | null;
        starList?: number[];
        desc?: string;
      }[];
      extraBet: {
        enable: boolean;
        iconA: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
        iconB: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
      };
      threshold: number | null;
      modeHigh: string;
      modeLow: string;
      modeHighLowList: string[];
      rtpList: number[];
    };

    type GameSetParamsSearch = Pick<GameSetParams, 'gameId' | 'group'>;

    type GameSetParamsRecordSearch = Pick<GameSetParams, 'gameId' | 'group'> & GameCommonSearchParams;

    type GameBuyFeature = {
      name: string;
      enable: boolean;
      mode: string;
      rtp: number;
      count: string;
      star: number;
      desc: string;
    };

    type TMetaBuyFeature = {
      buyFeature?: {
        [key: string]: GameBuyFeature;
      };
      extraBet?: {
        iconA: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
        iconB: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
      };
    };

    /** 游戏简要数据 */
    type PadminGameSimpleInfoDTO = {
      category?: string;
      id?: number;
      /** games 表 meta 列，如 buyFeature 等 */
      meta?: TMetaBuyFeature;
      name?: Record<GlobalLangType, string>;
      provider?: string;
      providerGameId?: string;
      subProvider?: string;
    };

    type GameSetParamsList = {
      buyFeature?: {
        /** Optional 額外附加購買倍數。key 為 feature name，value 為該遊戲特色對應的額外附加購買倍數, 陣列不可為空，不可與基礎購買倍數相同 */
        addOn?: Record<string, number[]>;
        /** 遊戲預設購買倍數，key 為 feature name，value 為該遊戲特色對應的購買倍數，無法被設定 */
        base?: Record<string, number>;
        /** 購買金額限制，預設 -1 */
        costLimit?: number;
        /** Optional 開啟狀態。key 為 feature name，value 為該遊戲特色對應的開啟狀態，可使用缺省設定,開啟數量不得超過三個 */
        enable?: Record<string, boolean>;
      };
      extraBet?: {
        enable: boolean;
        iconA?: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
        iconB?: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
      };
      option?: {
        rtp: number;
        winLimit: number;
        threshold: number | null;
        modeHigh: string;
        modeLow: string;
        buyFeature?: {
          // 玩法模组
          [key: string]: Pick<GameBuyFeature, 'mode' | 'rtp'>;
        };
      };
      optionGetRtpList?: {
        default: number;
        list?: { [key: string]: number } | object;
        // 模组数组
        mode: object;
        modeHigh?: string;
        modeLow?: string;
        threshold?: number | null;
      };
      vipBets?: { [key: string]: number[] } | object;
      game?: PadminGameSimpleInfoDTO;
    };

    type GameSetParamsReq = GameSetParamsList & {
      gameId: number | null | undefined;
      group: number | undefined;
    };

    type GameSetParamsOperation = Pick<GameSetParamsList, 'buyFeature' | 'option' | 'extraBet'> & {
      createdAt: string;
      boUserName: string;
      gameId: number;
      group: number;
    };

    type GameSetParamsOperationList = Common.PaginatingQueryRecord<GameSetParamsOperation>;

    type PlatformSearchParams = {
      storeId?: string | null;
      category?: string;
      status?: string;
      dataType: number;
      platform?: string;
      group?: number;
      brandId?: number;
      clientType?: number;
      isPopular?: number;
    };

    type TimeSetSearch = {
      jobType: number;
      executeTime: string;
      storeId: string;
      clientType?: number;
    };

    type BatchPublishParams = {
      jobType: number;
      executeTime: string;
      /** 有彩金店家 */
      bonusStoreIds: string[];
      /** 无彩金店家 */
      noBonusStoreIds: string[];
    };

    /** platform game group */
    type PadminGameGroup = {
      /** 数据类型（测试或正式） */
      dataType?: number;
      /** 游戏id */
      gameId?: number;
      /** 馆别 */
      group?: number | null;
      /** 置顶 0:普通 1:置顶 -1:置底 */
      layer?: number;
      /** 配置 */
      meta?: any;
      /** 平台 */
      platform?: string | null;
      /** 发布版本 */
      publishVersion?: number;
      /** 设置 */
      setup?: number;
      /** 设置vip */
      setupVip?: number;
      /** 状态 */
      status?: number;
      /** 排序权重 */
      weight?: number;
    };

    type GameGroupListResp = {
      gameGroups?: PadminGameGroupInfo[];
    };

    /** platform game group info */
    type PadminGameGroupInfo = PadminGameGroup & {
      /** 是否有大图标 */
      big?: boolean;
      /** 类别 */
      category?: string;
      /** 名称 */
      name?: Record<GlobalLangType, string>;
      /** 绑定平台 有彩金无彩金 */
      clientType?: number;
    };

    /** 游戏总表列表查询；筛选数组为空或不传表示该维度不筛选（全部） */
    type GameSummaryListReq = {
      startAt: string;
      endAt: string;
      storeIds?: string[];
      categorys?: string[];
      gameIds?: number[];
      brandIds?: number[];
      /** 绑定平台标识列表（与 `platformOptions` value 一致，按店家查询时使用） */
      clientTypes?: string[];
    };

    type GameSummaryListResp = {
      records: SummaryCategoryItem[];
    };

    type SummaryCategoryItem = {
      /** 店家 */
      storeName?: string;
      storeId?: string;
      /** 游戏类别 */
      category?: string;
      /** 游戏厂牌 id */
      brandId?: number | null;
      /** 游戏id */
      gameId?: number;
      /** 游戏名称 */
      gameName?: string;
      /** 游戏总投注 */
      totalBet?: number;
      /** 游戏总赢分 */
      totalWin?: number;
    };
  }
}
