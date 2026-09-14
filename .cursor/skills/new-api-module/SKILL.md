---
name: new-api-module
description: 创建新的 API 模块与类型。新增后端接口封装时使用。
---

# 创建 API 模块

## 位置

- API：`src/service/api/{模块名}.ts`
- 类型：`src/typings/api/{模块名}.d.ts`
- 导出：`src/service/api/index.ts`

## 示例

```typescript
// src/service/api/demo-item.ts
import { request } from '../request';

export function fetchDemoItemList(params?: Api.DemoItem.ListReq) {
  return request<Api.DemoItem.ListResp>({
    url: '/demo/item/list',
    method: 'GET',
    params
  });
}
```

```typescript
// src/typings/api/demo-item.d.ts
declare namespace Api {
  namespace DemoItem {
    interface ListReq {
      pageIndex?: number;
      pageSize?: number;
      keyword?: string;
    }
    interface ListResp {
      items?: Item[];
      total?: number;
    }
    interface Item {
      id: string;
      name: string;
    }
  }
}
```

```typescript
export * from './demo-item';
```

## 注意

1. 禁止业务直接 axios
2. 统一 `request`，返回 `{ data, error }`
3. url **不含** baseURL 前缀（由 env 提供）
4. 模板默认可能 mock 登录；业务接口按真实后端配置
