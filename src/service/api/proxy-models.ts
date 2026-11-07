import type { AdminProxyModels } from '@/utils/proxy-models';
import { nestRequest } from '../request/nest';

export function fetchAdminProxyModels() {
  return nestRequest<AdminProxyModels>({ url: '/admin/proxy-models', method: 'get' });
}

export function saveAdminProxyModels(data: { textModel: string; imageModel: string }) {
  return nestRequest<AdminProxyModels>({ url: '/admin/proxy-models', method: 'put', data });
}

export function refreshAdminProxyModels() {
  return nestRequest<AdminProxyModels>({ url: '/admin/proxy-models/refresh', method: 'post' });
}
