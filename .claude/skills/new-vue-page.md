---
trigger: new-vue-page
description: 创建 Vue 页面组件
---

# new-vue-page - 创建 Vue 页面

创建符合 Soybean Admin 规范的 Vue 页面组件。

## 触发条件

用户需要创建新的页面组件时，例如：
- "创建一个会员管理页面"
- "新增一个游戏设置页面"
- "帮我写一个 xx 功能的页面"

## 规范要求

### 1. 文件位置
- 页面放在 `src/views/{模块名}/{页面名}/index.vue`
- 子组件放在 `src/views/{模块名}/{页面名}/modules/`

### 2. 代码结构
```vue
<script setup lang="ts">
import { useRole } from '@/hooks/business/role';

defineOptions({ name: '页面名称' });

const { shouldShowComponent, hasButtonPrivilege } = useRole();
const PAGE_PATH = '/模块路径'; // 用于权限判断
</script>

<template>
  <div class="h-full flex flex-col gap-16px">
    <!-- 搜索区域 -->
    <div class="md:px-16px md:py-10px">搜索表单</div>

    <!-- 表格区域 -->
    <div class="flex-1-hidden">表格组件</div>
  </div>
</template>

<style scoped>
/* 仅复杂样式使用 scoped，简单样式用 UnoCSS */
</style>
```

### 3. 权限控制
```ts
// read 权限组件（查看类）
<组件 v-if="shouldShowComponent('read')" />

// write 权限组件（编辑类）
<按钮 v-if="shouldShowComponent('write')" />

// 单独按钮权限
<按钮 v-if="hasButtonPrivilege('/path:action')" />
```

### 4. 样式规范
- 优先使用 UnoCSS 原子化类名
- 布局使用 `flex`, `gap-16px`, `flex-1-hidden` 等
- 间距使用 `p-16px`, `m-8px` 等

### 5. 表格规范
- **普通表格**：**`JQDataTable`**（`custom/data-table.vue`）；**特殊表格**（合并行/特殊行/列等）：**VxeTable**，优先 `custom/` 封装。
- **导出**：统一 **`FileExportDialog`**。
- 支持分页、排序、筛选（随所选表格方案）

## 输出

1. 创建页面主文件
2. 如有需要创建子组件
3. 在 roleConfig.ts 中添加权限路径（如需）
4. 添加国际化文案（如需）
