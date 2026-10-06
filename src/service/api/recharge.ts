import { nestRequest } from '../request/nest';

export function fetchRechargePackages() {
  return nestRequest<Api.Recharge.PackageListResp>({
    url: '/admin/recharge-packages',
    method: 'get'
  });
}

export function fetchCreateRechargePackage(data: Api.Recharge.CreatePackageReq) {
  return nestRequest<Api.Recharge.Package>({
    url: '/admin/recharge-packages',
    method: 'post',
    data
  });
}

export function fetchPatchRechargePackage(id: string, data: Api.Recharge.PatchPackageReq) {
  return nestRequest<Api.Recharge.Package>({
    url: `/admin/recharge-packages/${id}`,
    method: 'patch',
    data
  });
}

export function fetchDeleteRechargePackage(id: string) {
  return nestRequest<{ ok: true }>({
    url: `/admin/recharge-packages/${id}`,
    method: 'delete'
  });
}

export function fetchRechargeOrders(params: Api.Recharge.OrderListQuery) {
  return nestRequest<Api.Recharge.OrderListResp>({
    url: '/admin/recharge-orders',
    method: 'get',
    params
  });
}

export function fetchGenerateRechargeCards(data: Api.Recharge.GenerateCardsReq) {
  return nestRequest<Api.Recharge.GenerateCardsResp>({
    url: '/admin/recharge-cards/generate',
    method: 'post',
    data
  });
}

export function fetchRechargeCards(params: Api.Recharge.CardListQuery) {
  return nestRequest<Api.Recharge.CardListResp>({
    url: '/admin/recharge-cards',
    method: 'get',
    params
  });
}

export async function downloadRechargeCardsExport(params: Api.Recharge.CardListQuery) {
  const { getNestBaseURLForExport } = await import('../request/nest-export');
  return getNestBaseURLForExport('/admin/recharge-cards/export', params);
}

export function fetchRechargeCardShopConfig() {
  return nestRequest<Api.Recharge.ShopConfigResp>({
    url: '/admin/recharge-cards/shop-config',
    method: 'get'
  });
}

export function patchRechargeCardShopConfig(data: Api.Recharge.PatchShopConfigReq) {
  return nestRequest<Api.Recharge.ShopConfigResp>({
    url: '/admin/recharge-cards/shop-config',
    method: 'patch',
    data
  });
}
