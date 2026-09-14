/**
 * 彩金相关接口的 Mock 数据（用于 VITE_SERVICE_MOCK=Y 时本地调试）
 * 类型与 Api.GameJackpot 保持一致
 */

/** 彩金历史列表 - 用于 GET /game/jackpot/history */
export const mockGameJackpotHistoryResp: Api.GameJackpot.GameJackpotHistoryResp = {
  results: [
    {
      createdAt: '2025-02-12T10:00:00.000Z',
      gameCategory: 'slot',
      gameId: 1001,
      gameName: { en: 'Mock Jackpot Game', zh: '彩金示例游戏' },
      jackpotGroup: 1,
      jackpotLevel: 1,
      machineNumber: 10001,
      minBet: 10,
      proxyId: 'proxy_mock_1',
      storeId: 'store_mock_1',
      userId: 20001,
      userName: 'mock_user_1',
      values: 500,
      wagerId: 'wager_mock_001'
    },
    {
      createdAt: '2025-02-12T09:30:00.000Z',
      gameId: 1002,
      gameName: { en: 'Another Game' },
      jackpotLevel: 2,
      machineNumber: 10002,
      minBet: 20,
      storeId: 'store_mock_1',
      userId: 20002,
      userName: 'mock_user_2',
      values: 1200,
      wagerId: 'wager_mock_002'
    }
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2
};

/** 店家列表 - 用于 GET /bo/user/find-store */
export const mockPboBoUserStoreListResp: Api.GameJackpot.PboBoUserStoreListResp = {
  items: [
    {
      boUserId: 'store_mock_1',
      name: 'Mock 店家 A',
      hierarchy: '1',
      boundAt: '2025-01-01T00:00:00.000Z',
      status: '',
      remark: ''
    },
    {
      boUserId: 'store_mock_2',
      name: 'Mock 店家 B',
      hierarchy: '1',
      boundAt: '2025-01-02T00:00:00.000Z',
      status: '',
      remark: ''
    }
  ]
};
