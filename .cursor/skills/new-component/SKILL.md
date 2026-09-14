---
name: new-component
description: 创建可复用 Vue 组件。表格、弹窗、搜索等可复用 UI 时使用。
---

# 创建通用组件

## 位置

- 业务局部：`src/views/{模块}/{页面}/modules/组件名.vue`
- 通用：`src/components/{分类}/组件名.vue`（框架级优先 `custom/`）

## 结构要点

- `defineOptions({ name })`
- Props：`withDefaults(defineProps<Props>(), …)`
- Emits：TS 声明；`update:xxx` 用于 v-model
- 优先箭头函数；样式 scoped + UnoCSS
- **先查**是否已有 `JQ*` / `PageMenu` / `FileExportDialog` 等封装

## 输出

组件文件、引用方式、必要 i18n
