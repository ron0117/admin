# 接口 Mock 数据

当 `VITE_SERVICE_MOCK=Y` 时，请求会优先命中本目录及 `mock-handlers.ts` 中注册的 mock，不发真实请求。

## 如何用 Mock 调试彩金历史页

1. 打开 `.env.test`，将 `VITE_SERVICE_MOCK=N` 改为 `VITE_SERVICE_MOCK=Y`。
2. 重启本地 dev（`pnpm dev`），再打开彩金历史页面。
3. 列表与店家下拉会使用 `mock-data/game-jackpot.ts` 中的数据，无需后端。

## 新增 Mock 接口

1. 在 `mock-data/` 下按模块添加或修改 mock 数据（类型与 `typings/api` 一致）。
2. 在 `mock-handlers.ts` 的 `mockHandlers` 中增加一项：`'method:/path': () => yourMockData`。
3. 保持 `VITE_SERVICE_MOCK=Y` 即可生效。
