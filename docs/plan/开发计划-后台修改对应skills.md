# 开发计划 · 后台修改对应 skills

> 对齐：[需求梳理版](../detail/需求-后台修改对应skills-梳理版.md)、[技术设计](../design/技术设计-后台修改对应skills.md)  
> Nest 细项：[nestjs/docs/plan/开发计划-后台修改对应skills.md](../../../nestjs/docs/plan/开发计划-后台修改对应skills.md)  
> Electron 细项：[electron/docs/plan/开发计划-后台修改对应skills.md](../../../electron/docs/plan/开发计划-后台修改对应skills.md)  
> MVP：Must UC-01～11  
> 粗估：**1.5～2.5 人天**（Nest 0.5～0.8 + Admin 0.4～0.6 + Electron 0.6～1.0）  
> **须用户再说「按计划开发」后才写业务代码**

跨项目：前缀 **N** = `nestjs/`，**A** = `admin/`，**E** = `electron/`。命令在对应项目根执行。

---

## 1. 里程碑

| 里程碑 | 目标 | 建议耗时 | 完成标志 |
|--------|------|----------|----------|
| M0 列与接口 | `skillPrompt` 可空列；两个 GET 与 PATCH 语义 | 0.5～0.8d | e2e：写入、清空、省略不覆盖、超长 400 |
| M1 Admin | 功能设置可编辑并回显 | 0.4～0.6d | 5 个图片功能有输入框；文案仿写没有；typecheck 过 |
| M2 Electron | 五处出图前缀，重试不双拼 | 0.6～1.0d | 单测过；裂变分析与文案仿写请求不变 |
| M3 收尾 | 对照 AC 联调 | 0.2d | 空配置与现网 prompt 一致 |

**依赖：** M0 → M1 / M2（M2 不依赖 Admin 页面，依赖 M0 的字段）。M1 与 M2 可并行。  
**不可打乱：** 不得先改桌面拼接而服务端尚未返回 `skillPrompt`（缺字段虽按空处理，但无法验收已配置路径）。

Won't（文案仿写配置、按规格拆段、版本历史）不进本计划。

---

## 2. 任务拆分（可勾选）

### M0 · Nest（NU-01～08）

- [ ] N0.1 `PointFeature.skillPrompt String? @db.Text` + migrate
- [ ] N0.2 `PatchPointFeatureDto.skillPrompt` 可选，`@MaxLength(4000)`
- [ ] N0.3 `patch`：省略不更新；trim 空存 `null`；与 remark/specs 同一事务
- [ ] N0.4 `toDto` 输出 `skillPrompt: string`（`null` → `''`），两个 GET 共用
- [ ] N0.5 seed 的 update 仍只有 `name`、`sort`
- [ ] N0.6 e2e：写入、空白清空、省略保持、4001 字不改库、桌面 JWT 不能 PATCH

### M1 · Admin（UC-01～04、11）

- [ ] A1.1 `Api.Points.Feature` / `PatchFeatureReq` 增加 `skillPrompt`
- [ ] A1.2 列表「Skills」列：非空为已配置，空为未配置；文案仿写显示未配置且不可编辑
- [ ] A1.3 图片功能弹窗 textarea，`maxlength=4000`、`showWordLimit`；与单价、备注一次提交
- [ ] A1.4 文案仿写提交体不带 `skillPrompt`
- [ ] A1.5 `points` 文案补「生图 Skills / 已配置 / 未配置 / 超长」（与现有积分页同一套语言文件）
- [ ] A1.6 `pnpm typecheck`；无 `console.log`

### M2 · Electron（UC-05～10）

- [ ] E2.1 `PointFeature.skillPrompt?`；`usePointFeatures().skillOf`
- [ ] E2.2 `shared/generate/skill-prompt.ts` 的 `prependSkillPrompt` + 单测
- [ ] E2.3 灵感、原景出新、自由创作：`aiGenerateImage` 前拼一次；自由创作仍先校验用户输入非空
- [ ] E2.4 裂变：只拼 `compileFissionBatchPrompt` 的结果再写入 `lastBatchPrompt`；分析 `aiChat` 与重试不二次拼接
- [ ] E2.5 `LiveGenerateRequest.skillPrompt?`；主进程在 `provider.generate` 前拼一次，不拼识图种子
- [ ] E2.6 文案仿写不调用 `skillOf`

### M3 · 收尾

- [ ] T3.1 Nest e2e 与 Electron `prependSkillPrompt` 单测绿
- [ ] T3.2 手工：后台保存一段文字 → 桌面重新进入创作页 → 抓出图 prompt 以前缀开头
- [ ] T3.3 手工：清空后出图 prompt 与未配置时一致

### 不在本计划

- 文案仿写配置、按 live 规格分三段、提示词版本、运营预览拼接结果、改积分扣费

---

## 3. 依赖顺序

```text
N0 migrate + PATCH/GET
  → A1 后台弹窗（可与 E2 并行）
  → E2 桌面拼接
      → T3 联调
```

---

## 4. MVP 对齐

Must UC-01～11 全部进入 M0～M2。列表状态列属于 UC-01，放在 A1.2，不另开里程碑。

---

## 5. 风险与缓冲

| 风险 | 缓冲 |
|------|------|
| 裂变重试路径漏改，前缀加两次 | E2.4 单独勾选；自测要打重试 |
| live 拼进识图对话 | E2.5 限定 `provider.generate` 的 `prompt` |
| 旧 e2e 断言功能 DTO 字段全集 | N0.6 同时改断言，避免只加列却让旧用例红 |
| 估算偏紧 | 缓冲 0.3 人天给裂变两条出图路径（首轮 + 继续） |

---

## 6. 文档映射

| 文档 | 路径 |
|------|------|
| 产品梳理 | [docs/detail/需求-后台修改对应skills-梳理版.md](../detail/需求-后台修改对应skills-梳理版.md) |
| 技术设计 | [docs/design/技术设计-后台修改对应skills.md](../design/技术设计-后台修改对应skills.md) |
| 本文 | `docs/plan/开发计划-后台修改对应skills.md` |
| 自测方案 | `docs/test/自测方案-后台修改对应skills.md` |
