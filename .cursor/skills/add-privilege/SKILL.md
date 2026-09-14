---
name: add-privilege
description: 【模板已停用】原用于配置 privilege。本仓已移除真实权限体系。
---

# 已停用：add-privilege

本框架模板**已删除** `roleConfig` / `PRIV` 与真实权限过滤；`judgePrivilege` / `v-auth` 为 **stub 全通**。

- 不要按 o2o-backoffice 流程新增权限树
- 需要 RBAC 时另开需求，并统一改造 guard / 菜单 / PageMenu / 指令
- 详见 `.cursor/rules/project-rules.mdc`
