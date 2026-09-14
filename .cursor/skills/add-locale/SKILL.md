---
name: add-locale
description: 添加国际化文案。多语言、中英文案时使用。默认语言为 zh-cn。
---

# 添加国际化文案

## 位置

- 语言包：`src/locales/langs/zh-cn.ts`、`zh-tw.ts`、`en-us.ts`
- 页面拆分：`src/locales/langs/pages/*.ts`（按模块）
- 路由文案：各语言文件的 `route` 段（key 对齐 `RouteKey`）

## 命名

```
page.模块.页面.描述
route.路由key
common.* / form.*
```

## 注意

- **默认语言 / fallback：`zh-cn`**
- 三语尽量同步；至少补 `zh-cn`
- 使用 `$t('...')` 或 `useI18n().t`
- 查重 key，避免覆盖

## 输出

1. 写入对应 locale
2. 给出使用示例
3. 列出新增 key
