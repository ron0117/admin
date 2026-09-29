# 技术设计 · 后台修改对应 skills

> 对齐：[需求-后台修改对应skills-梳理版](../detail/需求-后台修改对应skills-梳理版.md)  
> Nest 列与 PATCH 语义以 [nestjs 技术设计](../../../nestjs/docs/design/技术设计-后台修改对应skills.md) 为准  
> Electron 拼接点以 [electron 技术设计](../../../electron/docs/design/技术设计-后台修改对应skills.md) 为准  
> 已锁定：Q-01 一个换行；Q-02 弹窗与接口都拦 4000；Q-03 文案仿写本期不配；Q-04 重试沿用已拼 prompt

---

## 1. 目标与约束

| 项 | 内容 |
|----|------|
| 目标 | 运营在功能设置里为 5 个图片功能保存 skills；桌面生图把该文本放在本地提示词前 |
| 基座 | 现有 `PointFeature`、`PATCH /admin/point-features/:menuCode`、`GET /point-features`、创作页 `aiGenerateImage` / `aiGenerateLive` |
| 约束 | 不新建功能行；不改单价校验与扣费；不改 `prompt-templates` 函数签名；不新开配置接口 |
| 非目标 | 文案仿写、识图分析、智能裁剪、按规格拆段、版本历史 |

### 1.1 可行性（Go）

| 维度 | 结论 | 说明 |
|------|------|------|
| 数据 | Go | `PointFeature` 加可空 `skillPrompt`，migrate 即可 |
| 鉴权 | Go | 管理 PATCH 已是后台 JWT；桌面 GET 已是桌面 JWT |
| 后台 | Go | `points/settings` 的 `JQDialogForm` 加 textarea |
| 桌面 | Go | 四个场景的 prompt 在渲染进程组好；live 的 motion prompt 在主进程，请求体多带一段可选文本 |

**门禁：Go。** 阻塞项只有 migrate，以及 live 必须在 `provider.generate` 前拼、不能拼在识图种子上。

---

## 2. 总体架构

```text
Admin  points/settings
  └─ PATCH /admin/point-features/:menuCode  { remark, specs, skillPrompt? }
        └─ PointFeature.skillPrompt

Electron  usePointFeatures 缓存（已有 GET /point-features）
  ├─ inspire / scene-renew / free / fission
  │     prependSkillPrompt → aiGenerateImage.prompt
  └─ live
        LiveGenerateRequest.skillPrompt
          └─ Main：motion 解析完成后、provider.generate 之前拼一次
```

中转站 URL、模型、积分 hold 都不改。

---

## 3. 模块职责

| 项目 | 改动 |
|------|------|
| Nest | 列、DTO、`toDto`、PATCH 省略/清空语义；seed 的 update 不写 `skillPrompt` |
| Admin | 类型、列表状态列、图片功能弹窗字段、提交体 |
| Electron | `PointFeature.skillPrompt`、纯函数 `prependSkillPrompt`、五处调用；live IPC 可选字段 |

---

## 4. 数据与接口（摘要）

列：`skillPrompt String? @db.Text`。库内 `null` = 未配置。出参统一 `skillPrompt: string`，`null` 转 `''`。

`PATCH` 的 `skillPrompt`：

| 请求 | 行为 |
|------|------|
| 字段省略 | 不更新 |
| `""` 或只含空白 | 存 `null` |
| trim 后 1～4000 字 | 存 trim 结果 |
| trim 后超过 4000 | 400，整单不写（含单价） |

桌面 `GET /point-features` 的 item 增加同名字段。旧客户端忽略即可。

图片功能 `menuCode`：

- `generate.create.inspire`
- `generate.create.fission`
- `generate.create.scene-renew`
- `generate.create.free`
- `generate.create.live`

`generate.create.copywrite` 的弹窗不提交 `skillPrompt`。

---

## 5. 拼接规则

```text
prependSkillPrompt(skill, local):
  prefix = trim(skill ?? "")
  if prefix == "" then return local
  return prefix + "\n" + local
```

| 场景 | local | 调用层 |
|------|-------|--------|
| 灵感 / 原景出新 / 自由创作 | 现有出图 prompt | 渲染进程，`aiGenerateImage` 前 |
| 裂变出图 | `compileFissionBatchPrompt` 的返回值 | 渲染进程，写入 `lastBatchPrompt` 之前拼一次 |
| 裂变重试 | 已保存的 `lastBatchPrompt` | 不再调用 prepend |
| live | 解析后的 motion prompt | 主进程，`provider.generate` 的 `prompt` 参数 |
| 裂变识图、文案仿写 | — | 不调用 |

自由创作仍先要求用户输入非空，再拼前缀。

---

## 6. 备选与否决

| 备选 | 否决原因 |
|------|----------|
| 新表 `PointFeatureSkill` | 一功能一段，列在 `PointFeature` 足够 |
| 按 live 规格三行 | 梳理版 UC-13 Won't |
| 主进程每次生图再 GET 配置 | 梳理要求用现有缓存，缺字段按空 |
| 改 `compile*Prompt` 读配置 | 模板须保持纯函数，便于单测 |

---

## 7. 风险与对策

| 风险 | 对策 |
|------|------|
| 裂变重试双前缀 | 只在首次编译 batch prompt 时拼；重试复用变量 |
| live 拼到识图对话 | 请求字段只在 `provider.generate` 使用 |
| PATCH 带空串误清空 | 文案仿写不传字段；图片功能用输入框当前值 |
| seed 覆盖运营文本 | update payload 保持只有 `name`、`sort` |

---

## 8. 用例追溯

| 验收 | 设计落点 |
|------|----------|
| AC-01～04 | Admin 列表列 + textarea `maxlength=4000`；Nest `@MaxLength(4000)` |
| AC-04～06 | §5 拼接点 |
| AC-07 | `skillPrompt` 缺省当 `''`，生图分支不新增失败码 |
| AC-08 | 沿用现有 Guard，不新开路由 |
| AC-09 | 不改 copywrite 页与 points hold |

---

## 9. 文档映射

| 文档 | 路径 |
|------|------|
| 产品梳理 | [docs/detail/需求-后台修改对应skills-梳理版.md](../detail/需求-后台修改对应skills-梳理版.md) |
| 本文 | `docs/design/技术设计-后台修改对应skills.md` |
| Nest 技术设计 | [nestjs/docs/design/技术设计-后台修改对应skills.md](../../../nestjs/docs/design/技术设计-后台修改对应skills.md) |
| Electron 技术设计 | [electron/docs/design/技术设计-后台修改对应skills.md](../../../electron/docs/design/技术设计-后台修改对应skills.md) |
| 开发计划 | `docs/plan/开发计划-后台修改对应skills.md` |
