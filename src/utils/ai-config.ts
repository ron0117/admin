export const AI_PROTOCOLS = [
  { value: 'chat-completions', label: '图文理解 / 对话（Chat Completions）' },
  { value: 'responses-image', label: '生图（Responses）' },
  { value: 'images-edit', label: '生图 / 编辑（Images REST）' },
  { value: 'wan-video', label: 'LIVE 视频（Wan）' }
] as const;

export type AiProtocol = (typeof AI_PROTOCOLS)[number]['value'];

export const AI_STAGES = [
  { value: 'fission.analyze', module: '图片裂变', label: '识图分析', protocols: ['chat-completions'], vision: true },
  {
    value: 'fission.generate',
    module: '图片裂变',
    label: '生成图片',
    protocols: ['responses-image', 'images-edit'],
    vision: false
  },
  { value: 'free.optimize', module: '自由创作', label: '优化提示词', protocols: ['chat-completions'], vision: true },
  {
    value: 'free.generate',
    module: '自由创作',
    label: '生成 / 修改图片',
    protocols: ['responses-image', 'images-edit'],
    vision: false
  },
  {
    value: 'copywrite.generate',
    module: '文案生成',
    label: '生成标题和正文',
    protocols: ['chat-completions'],
    vision: true
  },
  { value: 'live.motion', module: 'LIVE 创作', label: '动作提示词', protocols: ['chat-completions'], vision: true },
  { value: 'live.generate', module: 'LIVE 创作', label: '生成动态图片', protocols: ['wan-video'], vision: false }
] as const;

export type AiStage = (typeof AI_STAGES)[number]['value'];
export type AiBindings = Record<AiStage, string | null>;

export interface AiServiceProfile {
  id: string;
  name: string;
  protocol: AiProtocol;
  baseUrl: string;
  model: string;
  enabled: boolean;
  timeoutMs: number;
  supportsVision: boolean;
  hasApiKey: boolean;
  apiKeyMasked: string | null;
}

export interface AiServiceDraft extends AiServiceProfile {
  /** Present only in this page's memory until a successful save. Never persist in browser storage. */
  apiKey?: string;
}

export interface AdminAiConfig {
  draftRevision: number;
  publishedRevision: number;
  hasUnpublishedChanges: boolean;
  publishedAt: string | null;
  enabled: boolean;
  encryptionReady: boolean;
  services: AiServiceProfile[];
  bindings: AiBindings;
}

export interface AiConfigDraft {
  enabled: boolean;
  services: AiServiceDraft[];
  bindings: AiBindings;
}

export function canPublishAiConfig(config: AdminAiConfig | null, localDirty: boolean): boolean {
  return Boolean(config && !localDirty && config.hasUnpublishedChanges);
}

export function emptyAiBindings(): AiBindings {
  return Object.fromEntries(AI_STAGES.map(stage => [stage.value, null])) as AiBindings;
}

export function canBindAiService(stage: AiStage, service: AiServiceProfile): boolean {
  const rule = AI_STAGES.find(item => item.value === stage)!;
  return (
    service.enabled &&
    (rule.protocols as readonly string[]).includes(service.protocol) &&
    (!rule.vision || service.supportsVision)
  );
}

export function validateAiService(service: AiServiceDraft): string[] {
  const errors: string[] = [];
  if (!service.name.trim()) errors.push('请填写服务名称。');
  if (service.name.trim().length > 80) errors.push('服务名称不能超过 80 个字。');
  if (!AI_PROTOCOLS.some(item => item.value === service.protocol)) errors.push('请选择支持的调用方式。');
  if (!service.model.trim()) errors.push('请填写供应商提供的模型名称。');
  if (service.model.trim().length > 200) errors.push('模型名称不能超过 200 个字符。');
  try {
    const url = new URL(service.baseUrl.trim());
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      errors.push('接口地址仅支持 HTTP / HTTPS，不能包含账号、密码、查询参数或锚点。');
    }
  } catch {
    errors.push('请填写完整的接口基础地址，例如 https://api.example.com/v1。');
  }
  if (!Number.isInteger(service.timeoutMs) || service.timeoutMs < 1000 || service.timeoutMs > 1200000) {
    errors.push('超时需要在 1 至 1200 秒之间，且为整数毫秒。');
  }
  return errors;
}

export function validateAiConfig(draft: AiConfigDraft, forPublish = false): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const service of draft.services) {
    errors.push(...validateAiService(service).map(error => `${service.name || '未命名服务'}：${error}`));
    if (ids.has(service.id)) errors.push('服务标识重复，请删除重复项后重新添加。');
    ids.add(service.id);
  }
  for (const stage of AI_STAGES) {
    const serviceId = draft.bindings[stage.value];
    if (serviceId) {
      const service = draft.services.find(item => item.id === serviceId);
      if (!service || !canBindAiService(stage.value, service)) {
        errors.push(`${stage.module} · ${stage.label}：请选择已启用且调用方式、识图能力匹配的服务。`);
      } else if (forPublish && draft.enabled && !service.hasApiKey && !service.apiKey?.trim()) {
        errors.push(`${stage.module} · ${stage.label}：绑定的服务尚未保存 API Key。`);
      }
    }
  }
  if (forPublish && draft.enabled && !AI_STAGES.some(stage => draft.bindings[stage.value])) {
    errors.push('启用后台配置时，请至少为一个功能分配服务。');
  }
  return errors;
}

export function createAiConfigPayload(draft: AiConfigDraft, expectedDraftRevision: number) {
  return {
    expectedDraftRevision,
    enabled: draft.enabled,
    bindings: { ...draft.bindings },
    services: draft.services.map(service => ({
      id: service.id,
      name: service.name.trim(),
      protocol: service.protocol,
      baseUrl: service.baseUrl.trim().replace(/\/+$/, ''),
      model: service.model.trim(),
      enabled: service.enabled,
      timeoutMs: service.timeoutMs,
      supportsVision: service.supportsVision,
      ...(service.apiKey?.trim() ? { apiKey: service.apiKey.trim() } : {})
    }))
  };
}
