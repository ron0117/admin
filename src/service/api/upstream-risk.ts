import { nestRequest } from '../request/nest';

export function fetchUpstreamRisk(params: Api.UpstreamRisk.Query) {
  return nestRequest<Api.UpstreamRisk.Response>({ url: '/admin/upstream-risk', method: 'get', params });
}
