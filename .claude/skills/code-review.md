---
trigger: code-review
description: 代码审查
---

# code-review - 代码审查

审查代码是否符合项目规范。

## 触发条件

用户需要审查代码时，例如：
- "帮我检查这段代码"
- "代码 review"
- "看看有没有问题"

## 检查清单

### 架构规范
- [ ] 文件位置是否正确（views/service/api/constants）
- [ ] 是否直接使用了 axios（应使用 API 层）
- [ ] Store 修改是否通过 actions（禁止直接修改）
- [ ] 业务常量是否从 `business.ts` 导入

### 代码风格
- [ ] 是否使用 `<script setup lang="ts">`
- [ ] Props 是否使用 `withDefaults` 设置默认值
- [ ] Emits 是否使用 TypeScript 类型定义
- [ ] 是否使用了 `console.log`（生产代码禁止）

### 样式规范
- [ ] 是否优先使用 UnoCSS 原子化类名
- [ ] Scoped 样式是否仅用于复杂组件
- [ ] 是否使用了项目 SVG 图标（`<svg-icon>`）

### UI 规范
- [ ] Element Plus 对话框是否有 `:close-on-click-modal="false"`
- [ ] 普通表是否用 **JQDataTable**；复杂场景用 **VxeTable** 是否合理；导出是否均走 **FileExportDialog**
- [ ] UI 文案是否使用国际化（中文）

### 安全规范
- [ ] 用户输入是否通过 `reg.ts` 正则验证
- [ ] 是否避免了 `innerHTML`（使用 `v-html` 需配合 dompurify）
- [ ] Store ID 是否通过 `Number()` 消毒

### 权限规范
- [ ] 页面是否导入 `useRole` 进行权限判断
- [ ] 组件是否使用 `shouldShowComponent` 控制显示
- [ ] 按钮是否使用 `hasButtonPrivilege` 检查权限

## 输出

1. 列出所有发现的问题
2. 按严重程度分类（严重/警告/建议）
3. 提供修复代码示例
