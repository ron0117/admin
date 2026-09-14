# Cursor 规则说明

本目录为 **分层规则**：通用原则与 Vue/TS 技术栈分开，便于按需加载。

## 结构

| 路径 | 说明 |
|------|------|
| `ask-before-acting.mdc` | 不确定先反问（本仓保留） |
| `docs-process.mdc` | 需求文档四步流水线（本仓保留） |
| `project-rules.mdc` | 框架模板项目规范（always） |
| `ai-context.mdc` | 上下文入口策略（always） |
| `code-review.mdc` | 审查排除范围（always） |
| `common/` | 编码风格、Git、安全、测试 |
| `vue-ts/` | API/Store、UI/i18n |

## 使用

- Cursor 会加载 `.cursor/rules/` 下 `.mdc`（含子目录）
- `README.md` 仅说明，不作为规则
- 需求类任务：先看 `docs/` 流水线文档；框架约定以 `project-rules` 为准
- 选技能：`.cursor/skills/SKILL_INDEX.md`；场景表：`.cursor/AGENTS.md`

## 相对源项目（o2o-backoffice）的调整

- 已去掉 privilege / `roleConfig` / O2O 业务域专属约束
- 权限相关叙述改为「模板态 stub，勿当安全边界」
- 测试入口改为本仓自测文档，不再引用 `pnpm test:game-maintenance`
