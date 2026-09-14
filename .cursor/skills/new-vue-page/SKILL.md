---
name: new-vue-page
description: 按框架约定创建 Vue 页面。新功能页、列表页、PageMenu 页时使用。
---

# 创建 Vue 页面

## 1. 目录与路由

**注册路由最多两层**（相对 `views/`）。更深层级用 **PageMenu**。

| 层级 | 做法 |
|------|------|
| 二级页 | `views/{module}/{page}/index.vue`（或单层 `views/{page}/index.vue`） |
| 页内 Tab | `{tab}/config.ts` + `menu.vue`（**禁止** Tab 用 `index.vue`） |
| 子组件 | 同级 `modules/` |

`index.vue` 可为 `<PageMenu />` 或列表页本身。

## 2. 列表根布局

列表 / `menu.vue` 根节点用 **`JQCustomPage`** + `JQSearch` / `JQDataTable`：

```vue
<script setup lang="ts">
import { JQCustomPage, JQDataTable, JQSearch } from '@/components';

defineOptions({ name: 'DemoList' });
</script>

<template>
  <JQCustomPage>
    <JQSearch … />
    <JQDataTable class="flex-1" … />
  </JQCustomPage>
</template>
```

参考本仓：`views/demo/`。

## 3. 权限

模板态 **无真实权限**；`v-auth` / `judgePrivilege` 为 stub。  
**不要**新增 `roleConfig` / `PRIV` 树。若产品要 RBAC，另开需求。

## 4. 封装优先

| 场景 | 组件 |
|------|------|
| 根布局 | `JQCustomPage` |
| 多级 Tab | `PageMenu` |
| 表 / 搜索 / 导出 | `JQDataTable` / `JQSearch` / `FileExportDialog` |

## 5. 输出

页面文件、必要 `config.ts`+`menu.vue`、i18n（含 `route.*`）、API（如需）
