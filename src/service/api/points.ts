import { nestRequest } from '../request/nest';

export function fetchPointFeatures() {
  return nestRequest<Api.Points.FeatureListResp>({
    url: '/admin/point-features',
    method: 'get'
  });
}

export function fetchPatchPointFeature(menuCode: string, data: Api.Points.PatchFeatureReq) {
  return nestRequest<Api.Points.Feature>({
    url: `/admin/point-features/${encodeURIComponent(menuCode)}`,
    method: 'patch',
    data
  });
}

export function fetchPointLedgers(params: Api.Points.LedgerListQuery) {
  return nestRequest<Api.Points.LedgerListResp>({
    url: '/admin/point-ledgers',
    method: 'get',
    params
  });
}
