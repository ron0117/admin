# Admin 框架模板

从 `o2o-backoffice` 清洗得到的中后台前端框架模板（Vue 3 + Vite 7 + TypeScript + Element Plus + UnoCSS / Soybean Admin ELP）。

## 快速开始

```bash
# Node >= 20.19，pnpm >= 8.7
pnpm i
pnpm dev
```

默认开发地址见终端输出（通常为 `http://localhost:18101/`）。

## 默认行为

| 项 | 说明 |
|----|------|
| 登录 | 默认 **mock**（`VITE_AUTH_MOCK=Y`），任意账号密码可进入 |
| 权限 | **已关闭**：路由/菜单/`v-auth`/`PageMenu` 一律放行 |
| 业务 | O2O 业务页与 privilege 配置树已删除 |
| 示例 | `home` + `demo`（PageMenu + JQSearch / JQDataTable） |

接真实后端时：在 `.env` 将 `VITE_AUTH_MOCK=N`，并配置 `.env.test` / `.env.prod` 的 `VITE_SERVICE_BASE_URL`。

## 如何加页

1. 在 `src/views/` 下新增目录与 `index.vue`（文件约定路由）
2. 启动 `pnpm dev` 时 elegant-router 会自动更新 `src/router/elegant/*`
3. 需要时在 `src/locales/langs/*.ts` 的 `route` 中补充文案

页内多级 Tab（PageMenu）：

```text
src/views/your-page/index.vue          # <PageMenu />
src/views/your-page/.../config.ts      # { sort, name }
src/views/your-page/.../menu.vue       # Tab 内容
```

约定：相对 `views` 的模块路径一般为三段（如 `demo/example/table`）。

## 请求约定

- 统一走 `src/service/request`（基于 `@sa/axios`）
- 业务 API 放在 `src/service/api/*.ts`，经 `index.ts` 导出
- 不要在页面里直接创建 axios 实例

## 框架组件

具名导出见 `src/components/index.ts`：

- `JQForm` / `JQSearch` / `JQDataTable` / `JQDialogForm` / `JQDropdown` / `JQCustomPage` / `JQBatchProgressDialog`
- `PageMenu`（自动注册）

## 权限说明（重要）

本模板 **没有真实权限体系**。`judgePrivilege` / `hasMenuPrivilege` / `v-auth` 均为 stub。  
勿依赖 stub 行为做安全边界；若需要 RBAC，请另开需求接入。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发（test 模式） |
| `pnpm build` | 生产构建 |
| `pnpm typecheck` | 类型检查 |
| `pnpm lint` | ESLint |

## 文档

| 文档 | 路径 |
|------|------|
| 原始需求 | `docs/requirements/需求-框架.md` |
| 需求梳理 | `docs/detail/需求-框架-梳理版.md` |
| 技术设计 | `docs/design/技术设计-框架.md` |
| 开发计划 | `docs/plan/开发计划-框架.md` |
| 自测方案 | `docs/test/自测方案-框架.md` |
