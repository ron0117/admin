import type { AdminAiConfig, createAiConfigPayload } from '@/utils/ai-config';
import { nestRequest } from '../request/nest';

export function fetchAdminAiConfig() {
  return nestRequest<AdminAiConfig>({ url: '/admin/ai-config', method: 'get' });
}

export function saveAdminAiConfig(data: ReturnType<typeof createAiConfigPayload>) {
  return nestRequest<AdminAiConfig>({ url: '/admin/ai-config', method: 'put', data });
}

export function publishAdminAiConfig(expectedDraftRevision: number) {
  return nestRequest<AdminAiConfig>({
    url: '/admin/ai-config/publish',
    method: 'post',
    data: { expectedDraftRevision }
  });
}
