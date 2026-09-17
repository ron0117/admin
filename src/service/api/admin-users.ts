import { nestRequest } from '../request/nest';

export type NestElectronUser = {
  id: string;
  email: string;
  username: string | null;
  status: 'pending_verification' | 'active' | 'disabled';
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  points: number;
  roles: Array<{ id: string; name: string }>;
};

export type AdminUser = NestElectronUser;

export type AdminUserListResp = {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminUserListQuery = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: AdminUser['status'];
  roleId?: string;
};

export function fetchAdminUserList(params: AdminUserListQuery) {
  return nestRequest<AdminUserListResp>({
    url: '/admin/users',
    method: 'get',
    params
  });
}

export function fetchCreateAdminUser(data: { email: string; password: string; username?: string; roleIds?: string[] }) {
  return nestRequest<AdminUser>({
    url: '/admin/users',
    method: 'post',
    data
  });
}

export function fetchUpdateAdminUser(
  id: string,
  data: {
    email?: string;
    username?: string | null;
    status?: 'active' | 'disabled';
    roleIds?: string[];
  }
) {
  return nestRequest<AdminUser>({
    url: `/admin/users/${id}`,
    method: 'patch',
    data
  });
}

export function fetchResetAdminUserPassword(id: string, password: string) {
  return nestRequest<AdminUser>({
    url: `/admin/users/${id}/reset-password`,
    method: 'post',
    data: { password }
  });
}

export function fetchAdjustAdminUserPoints(id: string, data: Api.Points.AdjustReq) {
  return nestRequest<Api.Points.AdjustResp>({
    url: `/admin/users/${id}/points`,
    method: 'post',
    data
  });
}
