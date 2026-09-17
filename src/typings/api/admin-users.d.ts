declare namespace Api {
  namespace AdminUser {
    type Status = 'pending_verification' | 'active' | 'disabled';

    interface RoleRef {
      id: string;
      name: string;
    }

    interface Item {
      id: string;
      email: string;
      username: string | null;
      status: Status;
      emailVerifiedAt: string | null;
      createdAt: string;
      updatedAt: string;
      points: number;
      roles: RoleRef[];
    }

    interface ListQuery {
      page?: number;
      pageSize?: number;
      keyword?: string;
      status?: Status;
      roleId?: string;
    }

    interface ListResp {
      items: Item[];
      total: number;
      page: number;
      pageSize: number;
    }
  }
}
