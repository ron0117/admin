import { nestRequest } from '../request/nest';

export type RoleStatus = Api.Role.Status;
export type RoleItem = Api.Role.Item;
export type RoleListResp = Api.Role.ListResp;
export type RoleListQuery = Api.Role.ListQuery;
export type MenuNode = Api.Role.MenuNode;

export function fetchRoleList(params: RoleListQuery) {
  return nestRequest<RoleListResp>({
    url: '/admin/roles',
    method: 'get',
    params
  });
}

export function fetchRoleDetail(id: string) {
  return nestRequest<RoleItem>({
    url: `/admin/roles/${id}`,
    method: 'get'
  });
}

export function fetchCreateRole(data: { name: string; remark?: string }) {
  return nestRequest<RoleItem>({
    url: '/admin/roles',
    method: 'post',
    data
  });
}

export function fetchUpdateRole(
  id: string,
  data: {
    name?: string;
    remark?: string | null;
    status?: RoleStatus;
  }
) {
  return nestRequest<RoleItem>({
    url: `/admin/roles/${id}`,
    method: 'patch',
    data
  });
}

export function fetchPutRoleMenus(id: string, codes: string[]) {
  return nestRequest<RoleItem>({
    url: `/admin/roles/${id}/menus`,
    method: 'put',
    data: { codes }
  });
}

export function fetchMenuTree() {
  return nestRequest<{ items: MenuNode[] }>({
    url: '/admin/menus/tree',
    method: 'get'
  });
}
