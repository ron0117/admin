/**
 * 本地 Mock 路由表：仅在 VITE_SERVICE_MOCK=Y 时生效，用于不依赖后端调试页面。
 *  key: `${method.toLowerCase()}:${url}`，value: 返回 mock 数据的函数（可接收 config 做分页等）
 */
import { mockGameJackpotHistoryResp, mockPboBoUserStoreListResp } from './mock-data/game-jackpot';

type MockHandler = (config: { params?: any; data?: any }) => any;

const mockHandlers: Record<string, MockHandler> = {
  'get:/game/jackpot/history': () => {
    const resp = { ...mockGameJackpotHistoryResp };
    return resp;
  },
  'get:/bo/user/find-store': () => mockPboBoUserStoreListResp
};

function normalizeKey(method: string, url: string): string {
  const path = url.replace(/^\s*\/+/, '').split('?')[0];
  return `${String(method).toLowerCase()}:/${path}`;
}

export function getMockData(config: { method?: string; url?: string; params?: any; data?: any }): any | null {
  if (!import.meta.env.DEV || import.meta.env.VITE_SERVICE_MOCK !== 'Y') {
    return null;
  }
  const method = config.method || 'get';
  const url = config.url || '';
  const key = normalizeKey(method, url);
  const handler = mockHandlers[key];
  if (!handler) return null;
  return handler(config);
}
