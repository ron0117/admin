# 何时用哪个能力（Cursor AI 策略）

按用户意图选技能/文档，避免盲目全仓搜索。

| 用户意图/场景 | 优先动作 | 技能/文档 |
|---------------|----------|-----------|
| 复杂需求、从需求到自测 | 先规划再实现 | **req-to-test-flow**；并遵守 `docs-process` |
| 「按开发计划写代码」 | 读 plan + design，按任务实现 | 对应 `docs/plan/`、`docs/design/` |
| 检查代码 / code review | 审查 | **code-review** |
| 修 bug | 定位修复 | **fix-bug** |
| 加文案 / 国际化 | i18n | **add-locale**（默认 `zh-cn`） |
| 新 API | API + 类型 | **new-api-module** |
| 按接口生成列表 CRUD | API + PageMenu + 页面 | **api-to-list-page** |
| 新页面 | Vue 页 | **new-vue-page** |
| 新组件 | 可复用组件 | **new-component** |
| 金额精度 | Decimal | **decimal-calculation** |
| 加权限 / 按钮权限 | **告知已 stub**；勿按旧 privilege 流程 | 见停用技能说明 / project-rules |
| 不熟项目 / 选技能 | 先读索引 | `README.md` + `.cursor/skills/SKILL_INDEX.md` |
| 会话恢复 | 读当前任务文档 | `docs/detail|design|plan|test` |

**规则**：`.cursor/rules/project-rules.mdc`（always）、`ask-before-acting`、`docs-process`、`common/`、`vue-ts/`。
