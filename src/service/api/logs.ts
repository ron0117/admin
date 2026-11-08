import { nestRequest } from '../request/nest';

export function fetchAdminLogs(params: Api.Logs.ListQuery) {
  return nestRequest<Api.Logs.ListResp>({
    url: '/admin/logs',
    method: 'get',
    params
  });
}
