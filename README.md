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
| 示例 | `home`；`demo`（PageMenu + JQSearch / JQDataTable）已隐藏侧栏，仍可访问 `/demo` |

接真实后端时：在 `.env` 将 `VITE_AUTH_MOCK=N`，并配置 `VITE_NEST_BASE_URL`（开发默认 `http://localhost:3000`，`VITE_HTTP_PROXY=Y` 时走 `/proxy-nest`）。

## 管理员 / 用户管理（接 Nest）

后台登录账号与 Electron 用户**分表**：

| 页面 | 路径 | API | 说明 |
|------|------|-----|------|
| 管理员列表 | `/manage/admin` | `/admin/admins*` | 侧栏「账号管理」；可登录后台的 `AdminUser` |
| 用户列表 | `/user/list` | `/admin/users*` | 侧栏「用户管理」；Electron 桌面端 `User`，可多选业务角色 |
| 角色管理 | `/user/role` | `/admin/roles*`、`/admin/menus/tree` | 侧栏「用户管理」；Electron 生图菜单角色；勾父=全开 |

联调步骤：

1. 在 `nestjs/apps/nest-api`：`npx prisma migrate deploy` 后 **`npx prisma db seed`**（写入 `AdminUser` + 生图菜单 9 节点；旧 `User.role=admin` 不能再登后台）
2. Admin `.env`：`VITE_AUTH_MOCK=N`、`VITE_NEST_BASE_URL=http://localhost:3000`
3. 用 `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`（默认 `admin@example.com` / `admin12345`）登录
4. 登录走 `POST /admin/auth/*`（`JWT_ADMIN_SECRET`）；桌面端 `/auth/*` 的 token 不能调管理接口
5. 两表邮箱可相同，密码独立；API 走 `src/service/request/nest.ts`，不改全局 `{ code, data }` 封装
6. 角色改权限后，桌面端须刷新或重登（旧 Electron 包不读 `menus` 仍会全开生图）

## 积分

侧栏「积分」：

| 页面 | 路径 | API | 说明 |
|------|------|-----|------|
| 功能设置 | `/points/settings` | `GET/PATCH /admin/point-features` | 6 个创作功能；「修改」弹窗改规格单价与备注 |
| 积分流水 | `/points/records` | `GET /admin/point-ledgers` | 筛选分页；可复制 `requestId` |
| 用户列表 | `/user/list` | `POST /admin/users/:id/points` | 增加积分列与「调整积分」 |

联调：Nest `npx prisma migrate deploy && npx prisma db seed` 后，用后台账号登录。桌面端须升级才会预扣积分；未升级的旧包不调 hold。

相关文档：`docs/**` 下「积分模块」系列。

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
| 管理员管理需求 | `docs/requirements/需求-管理员管理.md` |
| 管理员管理梳理 | `docs/detail/需求-管理员管理-梳理版.md` |
| 管理员管理设计 | `docs/design/技术设计-管理员管理.md` |
| 管理员管理计划 | `docs/plan/开发计划-管理员管理.md` |
| 管理员管理自测 | `docs/test/自测方案-管理员管理.md` |
| 用户管理需求 | `docs/requirements/需求-用户管理.md` |
| 用户管理梳理 | `docs/detail/需求-用户管理-梳理版.md` |
| 用户管理设计 | `docs/design/技术设计-用户管理.md` |
| 用户管理计划 | `docs/plan/开发计划-用户管理.md` |
| 用户管理自测 | `docs/test/自测方案-用户管理.md` |
