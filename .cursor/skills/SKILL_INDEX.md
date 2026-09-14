# 技能索引（Cursor）

先据此判断场景，再打开对应 `SKILL.md`，勿一次加载全部。

## 推荐使用

| 技能名 | 一句话适用场景 |
|--------|----------------|
| **req-to-test-flow** | 需求→设计→计划→自测；或「按开发计划实现」 |
| **code-review** | 检查代码、规范、安全 |
| **fix-bug** | 功能异常、报错修复 |
| **add-locale** | 多语言文案（默认 `zh-cn`） |
| **new-api-module** | 新 API 模块与类型 |
| **api-to-list-page** | 按接口约定生成查询分页 CRUD 列表页（API + PageMenu + i18n，无真实权限） |
| **new-component** | 可复用 Vue 组件 |
| **new-vue-page** | 新功能页（`JQCustomPage` + Search/Table / PageMenu） |
| **decimal-calculation** | 金额/汇总等精度计算用 `@/utils/decimal` |

## 模板已停用（仅说明，勿按源项目流程执行）

| 技能名 | 原因 |
|--------|------|
| **add-privilege** / **check-permission** / **page-button-auth** | 真实 privilege 已移除，运行时 stub 全通 |
| **bo-user-options-cache** | O2O 店家/代理商业务缓存；本仓 systemStore 仅为空壳 |

**规则入口**：`.cursor/rules/project-rules.mdc`、`.cursor/AGENTS.md`。
