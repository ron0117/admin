# Live 低 / 中 / 高档位与积分调整

日期：2026-11-08；上传人：lin。

## 本次结果

| 客户端档位 | 客户端 / 后台计费键 | 发给模型的 resolution | 单条视频积分 |
| --- | --- | --- | --- |
| 低 | `480p` | `480P` | 15 |
| 中 | `768p` | `768P` | 30 |
| 高 | `2k` | `2K` | 70 |

新任务不再展示 1080P；默认保持 768P（中）。本地镜头动效仍是 1 积分/条；图片和文案价格不变。历史 1080P 与旧版档位仍可读取、查询和恢复，不改写已有任务或预扣账单。

封面始终来自该条任务的原图，保留原图分辨率。提示文案为：“封面预览使用原图高清画质。合成 Live Photo 时封面仍用原图，档位仅影响动态视频，选低档更省积分。”没有把低分辨率原图宣称为 2K。

Live 合成继续取前 3 秒、静音、30 fps；移除视频长边 1440 的统一缩小限制，只为编码对齐偶数尺寸。低、中、高视频均保留上游实际输出尺寸；JPEG/PNG/WebP 原图封面不随视频档位缩小。单条和批量上传阿里云盘、百度网盘共用该逻辑。

## 三个仓库

- [桌面端：lin/2026-11-08-batch-image-update](https://github.com/ron0117/electron/tree/lin/2026-11-08-batch-image-update)
- [服务端：lin/2026-11-08-live-quality-pricing](https://github.com/ron0117/nestjs/tree/lin/2026-11-08-live-quality-pricing)
- [管理端：lin/2026-11-08-live-quality-pricing](https://github.com/ron0117/admin/tree/lin/2026-11-08-live-quality-pricing)

服务端基于 `efc210f`，管理端基于 `51301de`，均包含本次拉取时的线上主分支。桌面端延续已经验证的本地分支，包含原图封面和批量 Live 上传。

## 真实接口验收

2026-11-08 对同一张 3:4 原图每档提交一次，均成功；测试直接调用上游验证参数，不修改或恢复客户端直连。正式链路仍为：客户端平台登录凭证 → 自己的后台 → 模型，模型密钥仅由后台持有。

共同参数：`POST https://metaso.cn/api/minimax/v2/video_generation`；`model=MiniMax-H3`，`duration=4`，`ratio=adaptive`，`fast_mode=false`，`context_ir_enabled=false`，一张 `role=first_frame` 的图片。仅 `resolution` 不同。

| 请求档位 | 返回档位 | 文件实际尺寸 | 提交后查询到完成（秒） |
| --- | --- | --- | --- |
| 480P | 480P | 480 × 640 | 15.7 |
| 768P | 768P | 768 × 1024 | 31.9 |
| 2K | 2K | 1440 × 1920 | 61.8 |

上述时间包含轮询间隔，只是这次样本，不承诺固定速度。“2K”是上游预设名，不承诺每个比例都固定为 2560 或 2048 像素；下载文件实测如表。三条文件均为 24 fps，上游任务报告 4 秒，容器总时长约 4.46 秒。合成 Live 仍取 3 秒。

[服务商分辨率说明](https://metaso.cn/minimax-h3)；[服务商请求示例](https://github.com/meta-sota/ComfyUI-MiniMaxH3-API/blob/main/README_EN.md)。服务商自己的计费积分不是工具箱用户积分，本次 15 / 30 / 70 是工具箱定价。

验证覆盖：三档真实成片；使用这些成片与全分辨率原图合成 Live，核对原图封面尺寸、视频尺寸、照片视频配对标识、相机参数和压缩包；三档客户端路由与预扣计费；服务端参数映射、幂等提交、旧任务恢复、原价退款；真实 PostgreSQL 兼容迁移执行和回滚。

## 技术部署顺序

1. 合并服务端分支，先备份数据库及当前价格。在已有数据库环境变量的服务端 `apps/nest-api` 目录执行：

   ```sh
   node scripts/point-prices-backup.cjs /安全备份目录/prices-before-live-20261108.json
   npm run prisma:generate
   npm run prisma:deploy
   npm run build
   ```

   随现有部署流程重启服务。新迁移是 `20261108100000_live_quality_tiers`，增加 480P 并将当前 768P / 2K 价格更新为 30 / 70；不修改用户余额、旧预扣、已结算账单或历史视频。不需要更换模型密钥或加密主密钥。

2. 登录后检查 `/api/point-features` 返回 `480p=15`、`768p=30`、`2k=70`。检查 `/api/ai/live/h3/jobs` 接受 `resolution=480p`，并仍要求同用户同档位的有效预扣。
3. 发布管理端；积分设置展示低 / 中 / 高并可分别修改。旧后台没有 480P 时仍保留其旧配置编辑能力。
4. 再发布桌面端。客户端显示价格、批量总价和实际预扣始终取后台配置；后台尚未部署时低档显示“待开通”，不能发起或扣分，不会伪装成 15 分可用。后台更新后重新聚焦客户端或刷新积分价格即可读取新价。

**本次只准备并上传代码，不代替技术部署生产后台，也不更新官网下载地址。**

## 测试和回滚

- 桌面端：`npx vitest run tests/ai/live-h3.test.ts tests/ai/live-r0.test.ts tests/ai/live-ipc-routing.test.ts tests/ai/live-ui-modes.test.ts tests/ai/live-local-media.test.ts tests/ai/live-photo-pair.test.ts tests/ai/live-upload-source.test.ts tests/config/live-original-cover.test.ts`；`npm run build`。
- 服务端：`npm run test:live-quality`；`npm run build`。
- 管理端：`npm run test:point-pricing`；`npm run typecheck`；`npm run build`。
- 真实视频调用记录不包含在安装包；回归测试不发起付费模型调用。

回滚先回退客户端和管理端，再按原流程回退服务代码。价格可用 `node scripts/point-prices-backup.cjs --restore /安全备份目录/prices-before-live-20261108.json` 恢复部署前快照，保留所有账单和余额。该快照覆盖各创作模块价格，恢复前确认部署后没有其他需要保留的调价。旧任务退款按原账单金额处理，不按新价倒算。
