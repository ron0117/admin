---
trigger: new-api-module
description: 创建 API 模块定义
---

# new-api-module - 创建 API 模块

在项目中创建新的 API 定义文件。

## 触发条件

用户需要创建或添加 API 接口时，例如：
- "创建一个获取用户列表的 API"
- "添加游戏管理的接口"
- "帮我写一个 xx 的 API 定义"

## 规范要求

### 1. API 定义文件位置
- API 定义：`src/service/api/{模块名}.ts`
- 类型定义：`src/typings/api/{模块名}.d.ts`

### 2. API 定义格式
```typescript
// src/service/api/game-manage.ts
import { request } from '../request';

/**
 * 获取游戏列表
 * @param params - 请求参数
 * @returns { data, error } - 成功返回数据，失败返回错误对象
 */
export function fetchGameList(params?: Api.GameManage.PGameListReq) {
  return request<Api.GameManage.PGameListResp>({
    url: '/game/list',
    method: 'GET',
    params
  });
}

/**
 * 创建游戏
 * @param data - 游戏数据
 * @returns { data, error }
 */
export function createGame(data: Api.GameManage.PGameCreateReq) {
  return request<Api.Common.RecordResponse>({
    url: '/game/create',
    method: 'POST',
    data
  });
}
```

### 3. 类型定义格式
```typescript
// src/typings/api/game-manage.d.ts
declare namespace Api {
  namespace GameManage {
    /** 游戏列表请求参数 */
    export interface PGameListReq {
      page?: number;
      pageSize?: number;
      name?: string;
      status?: '1' | '2';
    }

    /** 游戏列表响应 */
    export interface PGameListResp {
      games?: GameItem[];
      total?: number;
    }

    /** 游戏项 */
    export interface GameItem {
      gameId: string;
      name: string;
      status: '1' | '2';
      createdAt: string;
    }

    /** 创建游戏请求 */
    export interface PGameCreateReq {
      name: string;
      type: string;
      status?: '1' | '2';
    }
  }
}
```

### 4. API 导出
在 `src/service/api/index.ts` 中添加导出：
```typescript
export * from './game-manage';
```

## 注意事项

1. **禁止**在业务代码中直接使用 axios 调用
2. 所有 API 必须通过 `request` 函数封装
3. 返回格式统一为 `{ data, error }`
4. 类型定义使用 `declare namespace Api` 格式
5. 接口路径不包含 baseURL 前缀

## 输出

1. 创建/更新 API 定义文件
2. 创建/更新类型定义文件
3. 更新 index.ts 导出
