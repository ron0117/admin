import { nestRequest } from '../request/nest';

export type NestAdmin = {
  id: string;
  email: string;
  username: string | null;
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
};

export type AdminListResp = {
  items: NestAdmin[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminListQuery = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: NestAdmin['status'];
};

export function fetchAdminList(params: AdminListQuery) {
  return nestRequest<AdminListResp>({
    url: '/admin/admins',
    method: 'get',
    params
  });
}

export function fetchCreateAdmin(data: { email: string; password: string; username?: string }) {
  return nestRequest<NestAdmin>({
    url: '/admin/admins',
    method: 'post',
    data
  });
}

export function fetchUpdateAdmin(
  id: string,
  data: {
    email?: string;
    username?: string | null;
    status?: NestAdmin['status'];
  }
) {
  return nestRequest<NestAdmin>({
    url: `/admin/admins/${id}`,
    method: 'patch',
    data
  });
}

export function fetchResetAdminPassword(id: string, password: string) {
  return nestRequest<NestAdmin>({
    url: `/admin/admins/${id}/reset-password`,
    method: 'post',
    data: { password }
  });
}
