# CLAUDE.md - O2O 游戏后台项目规范

本文件定义了 Claude Code 在与项目交互时必须遵守的规则和约定。所有修改必须符合以下标准。

## 项目身份
- **类型**: O2O 游戏运营后台 (基于 Soybean Admin 模板)
- **核心领域**: 游戏维护、会员管理、门店运营
- **关键约束**: 所有业务逻辑必须与 `src/constants/business.ts` 保持一致

## 技术规范

### 架构与结构
- **文件放置规则**:
  ```
  views/               → 所有 Vue 视图（按功能分组，如 `views/system-setting/game-maintenance`）
  service/api/         → API 定义（禁止直接使用 axios 调用）
  constants/           → 业务规则仅允许在 `business.ts`，技术配置放在其他文件
  store/modules/       → Pinia 模块必须按关注点分离（tab, theme, auth）
  ```
- **禁止修改**:
  - 未经批准不得修改 `src/service/request/shared.ts`
  - 不得创建新的顶级目录（使用现有结构）
- **路由与目录层级**：`src/router/elegant` 与 `views/` 下**目录与注册路由最多两层**。若产品需要三层、四层信息架构，**不在路由中继续下钻**，而在**页面内**实现：**须默认使用 `PageMenu`**（`src/components/custom/page-menu.vue`，`<PageMenu />`）+ 子目录 **`config.ts` + `menu.vue`**；新建页**不应**首版先堆 `ElRadioGroup`/`ElTabs`。仅当 `PageMenu` 经评估仍无法满足时再手写 Tab，并注明例外原因。框架会按 **`index.vue`** 参与路由生成，故 Tab 内容入口用 **`menu.vue`**；二级路由页仍用 `index.vue`（内容多为 `<PageMenu />`）。

### 代码模式
- **函数写法**：在 TypeScript 与 Vue `<script setup>` 中**优先使用箭头函数**（`const fn = () => {}`、`const fn = async () => {}`），**少用 `function` 声明**；回调、事件处理、工具方法等一律用 `const` 绑定箭头函数。**例外**：必须依赖提升、或外部约定必须具名 `function` 时（极少）再使用 `function`。
- **API 调用规范**:
  ```ts
  // 正确（使用项目标准 API 层）
  import { gameMaintenanceApi } from '@/service/api'
  await gameMaintenanceApi.clearTimeRange()

  // 禁止
  axios.delete('/api/time-range')
  ```
- **状态管理**:
  - 所有 store 模块必须从 `src/store/shared` 导入辅助函数
  - 禁止直接修改状态（必须使用 store actions）

### UI 与样式
- **封装组件优先（实现顺序）**：实现前先查 `src/components/custom/` 是否已有能力；**禁止**已知有对应组件却仍先在业务页手写等价能力。多级页内 Tab → **`PageMenu`**；文件汇出 → **`FileExportDialog`**（`SERVER`/`CLIENT`/`client-export-api`，**统一**汇出入口，禁止在业务页直接 `xlsx`/自建下载链）；**普通表格** → **`JQDataTable`**（`custom/data-table.vue`）；复杂表格（合并行/特殊行/列等）→ **VxeTable**（见「表格开发」）；列表/搜索 → **`JQSearch`** 等（见既有页面）。
- **封装组件优先**：其余 UI 优先 `@/components/`；三级、四级见上文 **`PageMenu`**。
- **UnoCSS 要求**:
  - 所有新样式必须使用 `class="[css-原子化]"` 模式
  - 仅限 SCSS 文件中对复杂组件使用 `@apply`
  - SVG 图标：必须使用 `<svg-icon name="store" />`（来自 `assets/svg-icon/`）
- **Element Plus 规则**:
  - 对话框：必须包含 `:close-on-click-modal="false"`
- **表格开发**:
  - **普通表格**：使用 **`JQDataTable`**（`src/components/custom/data-table.vue`）。
  - **特殊表格**（合并行/列、表体特殊行、列级复杂行为等）：可使用 **vxe-table / VxeGrid**，优先在 `custom/` 二次封装；业务页汇出仍须走 **`FileExportDialog`**。

### 安全与验证
- **关键规则**:
  1. 所有用户输入必须通过 `src/constants/reg.ts` 正则验证
  2. 禁止使用 `innerHTML`（仅在必要时使用带 `dompurify` 的 `v-html`）
  3. API 调用中的 Store ID 必须通过 `Number(storeId)` 消毒
- **游戏业务特定规则**:
  - 时间范围操作必须遵守 `business.timeRangeRules`
- **权限配置**:
  - 配置文件中按钮数据（`pathType: 'btn'`）的 `path` 必须与对应功能调用的接口 API path 一致，服务端会据此判断账号是否有权调用该接口
  - **开放接口**：请求路径以 **`/gate`** 开头的接口为开放接口，不按上述规则做接口级权限约束；一般无需在 `roleConfig` 中为该接口 path 单独配置 `btn`（除非产品另有要求）。代码里只写 **`/gate/...`**，若网关带 **`/v2`** 前缀由 **baseURL** 统一配置。

## 工作流程要求
- **修改协议**:
  1. 修改前必须通过 Read 工具读取受影响文件
  2. 多文件变更（>2个文件）必须先使用 Plan Agent
  3. 提交时必须包含 `Co-Authored-By: Claude Opus 4.6`
- **测试要求**:
  - 修复 bug 后（如时间范围问题），必须执行：
    ```bash
    pnpm test:game-maintenance  # 使用业务专用测试脚本
    ```

## 项目特定指令
| 上下文            | 必须执行的操作                                  |
|-------------------|-----------------------------------------------|
| `游戏维护`        | 验证时间范围是否符合 `business.timeRangeRules` |
| `门店状态`        | 始终使用 `business.ts` 中的 `storeStatusMap`   |
| `会员资料`        | 显示前必须检查 `isTestAccount` 状态            |
| 权限/按钮配置     | 按钮的 `path` 须与对应接口 API path 一致，以便服务端做接口权限校验；**`/gate` 前缀接口除外**（开放接口） |
| 表格开发         | 普通表 **`JQDataTable`**；复杂表可用 **VxeTable**；下载/导出统一 **`FileExportDialog`** |
| 需求/页面开发    | 优先使用 `@/components/`（`src/components/`）下的自封装组件，该目录及子目录下组件已全局注册 |

## 禁止操作
- ❌ 未使用 `pnpm add --save-exact` 添加新依赖
- ❌ 无业务依据修改 `src/constants/`
- ❌ 在生产代码中使用 `console.log`
- ❌ 创建新的 SVG 图标（使用现有 `assets/svg-icon/` 集合）

## 用户偏好
- 提交格式：符合业务语境的常规提交规范
  `fix: 系统设定/游戏维护 → 修复清除时间范围后仍默认当天的问题`
- UI 字符串必须使用中文（禁止英文直写）
- 禁止自动提交变更

## AI 策略（Cursor）

- **不熟悉项目时**：先读 `docs/PROJECT_MAP.md` 建立项目全貌
- **不知道用哪个技能时**：先查 `.cursor/skills/SKILL_INDEX.md`，再按需加载对应 `SKILL.md`
- **何时用谁/用哪份文档**：见 `.cursor/AGENTS.md`
- **会话恢复**：先读 `docs/PROJECT_MAP.md`，再按当前任务读 `docs/plan/`、`docs/design/`、`docs/test/` 下对应文档
- **配置或审查权限时**：按钮数据（`pathType: 'btn'`）的 `path` 必须与对应功能所调用的接口 API path 一致，服务端会根据该 path 判断账号是否有权调用该接口；**`/gate` 前缀为开放接口**（不受该约束）

---
*本配置与 `package.json` 中的引擎要求自动同步（Node >=20.19.0）*
*最后更新：2026-04-17*
