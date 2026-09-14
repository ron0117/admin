---
name: api-to-list-page
description: >-
  根据接口约定生成带查询分页的 CRUD 列表页（API、类型、PageMenu、i18n、JQSearch+JQDataTable+JQDialogForm）。
  用户给出 path/类型或要求「按接口生成列表页」时使用。本模板不配置真实 privilege。
---

# 从接口生成列表 CRUD 页

## 何时使用

- 提供 list/create/update/delete 等接口约定
- 需要标准「查询 + 分页 + 弹窗表单」列表页

## 配合技能

| 步骤 | 技能 |
|------|------|
| API/类型 | **new-api-module** |
| 页面 | **new-vue-page** |
| 文案 | **add-locale** |
| 权限 | **跳过**（stub；见 project-rules） |

## 执行流程

### 1. 确认输入

接口 path、二级路由、是否 PageMenu Tab、筛选字段、多语言字段。

### 2. API 层

`service/api/{kebab}.ts` + `typings/api/{kebab}.d.ts` + `index.ts` 导出。  
url 去掉网关/base 前缀（由 `VITE_SERVICE_BASE_URL` 拼接）。

### 3. 目录

```
views/{module}/{page}/
├── index.vue                 # <PageMenu /> 或列表本身
└── {tab}/                    # 可选
    ├── config.ts
    └── menu.vue
```

### 4. menu.vue 模式

- `JQCustomPage` + `JQSearch` + `JQDataTable` + `JQDialogForm`
- `buildListParams` → `initData` → search/reset/pagination
- **不要**加 `PRIV` / `roleConfig` / `v-auth` 业务树（stub 可选演示除外）

### 5. i18n

补 `route.*` 与 `page.*`（至少 `zh-cn`）。

### 6. 自测

复制并填写 `checklist-template.md`（本目录）；权限项对本模板标 N/A。

## 输出

API、页面、文案清单；提醒用户按自测清单验证。
