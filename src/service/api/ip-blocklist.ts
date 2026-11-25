import { nestRequest } from '../request/nest';

export function fetchIpBlocklist(params: Api.IpBlocklist.ListQuery) {
  return nestRequest<Api.IpBlocklist.ListResp>({ url: '/admin/ip-blocklist', method: 'get', params });
}

export function createIpBlock(data: Api.IpBlocklist.CreatePayload) {
  return nestRequest<Api.IpBlocklist.Item>({ url: '/admin/ip-blocklist', method: 'post', data });
}

export function updateIpBlock(id: string, data: Api.IpBlocklist.UpdatePayload) {
  return nestRequest<Api.IpBlocklist.Item>({ url: `/admin/ip-blocklist/${id}`, method: 'patch', data });
}

export function unblockIp(id: string, reason: string) {
  return nestRequest<Api.IpBlocklist.Item>({ url: `/admin/ip-blocklist/${id}/unblock`, method: 'post', data: { reason } });
}

export function reblockIp(id: string, data: Api.IpBlocklist.ReblockPayload) {
  return nestRequest<Api.IpBlocklist.Item>({ url: `/admin/ip-blocklist/${id}/reblock`, method: 'post', data });
}
