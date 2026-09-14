---
trigger: add-privilege
description: 添加权限配置
---

# add-privilege - 添加权限配置

为页面或功能添加权限控制。

## 触发条件

用户需要添加权限配置时，例如：
- "给这个页面添加权限控制"
- "新增一个权限点"
- "这个按钮需要权限验证"

## 配置流程

### 1. 在 roleConfig.ts 中添加路径
```typescript
// src/roleConfig.ts
const privilegesTree: Api.BoRole.PrivilegesTreeNode[] = [
  {
    label: '路由名称',
    path: '/模块/页面',
    pathType: 'menu',
    children: [
      {
        label: '子页面',
        path: '/模块/页面/子页面',
        pathType: 'menu'
      }
    ],
    buttons: [
      {
        label: '按钮名称',
        path: '/模块/页面：操作',
        pathType: 'btn'
      }
    ]
  }
];
```

### 2. 在页面中使用权限
```vue
<script setup lang="ts">
import { useRole } from '@/hooks/business/role';

const { shouldShowComponent, hasButtonPrivilege } = useRole();
const PAGE_PATH = '/模块/页面';
</script>

<template>
  <!-- read 权限显示 -->
  <div v-if="shouldShowComponent('read')">查看内容</div>

  <!-- write 权限显示 -->
  <div v-if="shouldShowComponent('write')">编辑内容</div>

  <!-- 按钮权限 -->
  <button v-if="hasButtonPrivilege('/模块/页面：delete')">删除</button>
</template>
```

### 3. 权限类型说明
| 类型 | 说明 | 适用场景 |
|-----|------|---------|
| menu | 菜单/页面权限 | 页面显示、目录显示 |
| btn | 按钮权限 | 操作按钮、功能入口 |

### 4. 权限层级
- `none`: 无权限，不显示任何内容
- `read`: 只读权限，显示查看类组件
- `write`: 读写权限，显示全部组件 + 操作按钮

## 输出

1. 在 roleConfig.ts 中添加权限路径
2. 在页面中添加权限判断代码
3. 添加国际化文案（如需）
