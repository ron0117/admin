---
name: code-review
description: 按框架模板规范做代码审查。用户要求检查代码、code review 或排查规范问题时使用。
---

# 代码审查

## 检查清单

### 架构
- [ ] 文件位置正确（views / service/api / store / components）
- [ ] 未直接使用 axios（应走 `@/service/api`）
- [ ] Store 经 actions 修改
- [ ] 未恢复半套 privilege 过滤（stub 须一致全通或另开需求）

### 代码风格
- [ ] `<script setup lang="ts">`
- [ ] Props `withDefaults`；Emits 有类型
- [ ] 无生产 `console.log`
- [ ] 优先箭头函数

### UI
- [ ] 优先 `@/components/` 封装（`PageMenu` / `JQDataTable` / `JQSearch` / `FileExportDialog` / `JQCustomPage`）
- [ ] 对话框 `:close-on-click-modal="false"`
- [ ] 普通表用 `JQDataTable`；复杂表用 Vxe 有理由；导出走 `FileExportDialog`
- [ ] 文案走 i18n；默认语境简体中文

### 安全
- [ ] 边界校验；避免裸 `innerHTML`（`v-html` + dompurify）
- [ ] 无硬编码密钥；勿把前端 stub 当鉴权

### 排除
- 不审查 `node_modules/`、elegant 生成物细节、不存在的 `_apis` 巨文件

## 输出

1. 问题列表（严重 / 警告 / 建议）
2. 修复建议或示例
