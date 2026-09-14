declare namespace Api {
  namespace MemberManage {
    type MemberSearchParams = {
      userId?: string;
      name?: string;
      account?: string;
      storeId?: string;
      machineNumber?: number;
    };

    type TTicketItem = {
      action: string;
      amount: string;
      createdAt: string;
    };

    type MemberQuickPreviewResponse = {
      /** 头像 */
      avatar?: string;
      storeId?: string;
      /** 店家名称 */
      storeName?: string;
      /** 店家ID */
      userStore?: string;
      userId?: number;
      account?: string;
      password?: string;
      name?: string;
      /** 平台ID */
      clientType?: string;
      machineNumber?: number;
      isDeleted?: boolean;
      wallet?: {
        balance?: string;
      };
      latestTicketInput?: TTicketItem;
      latestTicketOutput?: TTicketItem;
    };

    type MachineNumberListParams = {
      storeId?: string;
    };

    type MachineNumberListResponse = {
      machineNumbers: number[];
    };

    type MemberFormData = {
      userId?: number;
      account?: string;
      password?: string;
      storeId?: string;
      name?: string;
      clientType?: string;
      machineNumber?: number;
    };

    // 机台号更新参数
    type UpdateMachineNumberParams = {
      userId: number;
      machineNumber: number;
    };

    type ResetPasswordParams = {
      userId: number;
      password: string;
    };

    type PlatformOption = {
      label: string;
      value: string;
    };

    type StoreOption = {
      accountType: string;
      boDepartmentId: string;
      boUserId: string;
      createdAt: string;
      email: string;
      name: string;
      status: string;
      updatedAt: string;
    };

    type DepositWithdrawParams = {
      userId: number;
      // balance: string;
      amount: number;
      action: 'boin' | 'boout';
      ticketId: string;
    };

    type MemberBasicInfoResponse = {
      account: string;
      avatar: string;
      credit: number;
      isMaster: boolean;
      level: number;
      name: string;
      phone: string;
      phoneNumber: string;
      subject: string;
      udid: string;
      userId: number;
      vip: number;
    };

    // 游戏记录相关类型
    type GameRecordSearchParams = {
      timeRange?: string[];
      startAt?: string;
      endAt?: string;
      category?: string;
      gameId?: number;
      wagerId?: string;
      storeId?: string;
    };

    type GameRecordListParams = GameRecordSearchParams & {
      userId: number;
    };

    /** 游戏记录 detail.ag（与后端字段扩展时同步） */
    type GameRecordDetailAg = {
      rtp?: string | number;
      features?: string[];
      [key: string]: unknown;
    };

    /** 游戏记录 detail.wow（与 detail.ag 同形） */
    type GameRecordDetailWow = {
      rtp?: string | number;
      features?: string[];
      [key: string]: unknown;
    };

    /** 游戏记录 detail.atg（ATG 厂商） */
    type GameRecordDetailAtg = {
      /** 存在且为布尔时：true→FG，false→NG；未返回则不展示游戏模式主文案 */
      isFree?: boolean;
      replayUrl?: string;
    };

    type GameRecordDetailRsg = {
      jackpotType?: GameType.RsgJackpotType;
    };

    type GameRecordItemDetail = {
      ag?: GameRecordDetailAg;
      wow?: GameRecordDetailWow;
      atg?: GameRecordDetailAtg;
      rsg?: GameRecordDetailRsg;
      [key: string]: unknown;
    };

    type GameRecordItem = {
      createdAt: string;
      gameId: number;
      name: string;
      ratio: string | number;
      placeId: string;
      betAmount: string | number;
      gameWin: string | number;
      jackpotWin: string | number;
      totalWinLoss: string | number;
      balance: string | number;
      reviewRoom: string;
      otherInfo: string;
      rtp: string;
      win: string | number;
      bet: string | number;
      wagerId: string;
      category?: string;
      provider?: string;
      fulfill?: number;
      raw?: any;
      detail?: GameRecordItemDetail;
      modeDetail?: any;
      // 兼容旧字段
      time?: string;
      gameCategory?: string;
      gameName?: string;
      payAmount?: string | number;
      playMode?: string;
      validBet?: string | number;
      rebate?: string | number;
      gameResult?: string;
    };

    // 游戏记录总表相关类型
    type GameRecordSummarySearchParams = {
      timeRange?: string[];
      startAt?: string;
      endAt?: string;
      category?: string;
      gameId?: number;
      storeId?: string;
    };

    type GameRecordSummaryParams = GameRecordSummarySearchParams & {
      userId: number;
    };

    type GameRecordSummaryResponse = {
      records: GameRecordSummaryItem[];
      totalProfit: string;
      totalBet: string;
      totalWin: string;
    };

    type GameRecordSummaryItem = {
      gameId: number;
      category: string;
      totalBet: string;
      totalWin: string;
      totalProfit: string;
    };

    // 存折相关类型
    type PassbookSearchParams = {
      timeRange?: string[];
      createdAtGte?: string;
      createdAtLte?: string;
    };

    type PassbookParams = PassbookSearchParams & {
      userId: number;
    };

    type PassbookItem = {
      project: string;
      memberOrTargetName: string;
      transactionTime: string;
      orderNumber: string;
      transactionParty: string;
      expense: string | number;
      income: string | number;
      balance: string | number;
      remark: string;
    };

    // 游戏回放参数
    type GameReplayParams = {
      gameId: number;
      wagerId: string;
      ratio: string | number;
      placeId: string;
      chairId?: number;
      userId: number;
    };

    // 游戏详情参数
    type GameRecordDetailParams = {
      providerGameId: string;
      wagerId: string;
    };

    /** ATG 其他咨询管理端 URL（GET `/gate/game/atg/admin-url`） */
    type AtgGameAdminUrlData = {
      url: string;
    };

    // 游戏记录导出参数
    type ExportGameRecordParams = {
      userId: number;
      startAt?: string | null;
      endAt?: string | null;
      category?: string | null;
      gameId?: number | null;
      wagerId?: string | null;
      storeId?: string | null;
    };

    // 店家数据类型
    type StoreDataItem = {
      shopId: string;
      name: string;
      account?: string;
      email?: string;
      status?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  }
}
