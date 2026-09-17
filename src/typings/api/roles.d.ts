declare namespace Api {
  namespace Role {
    type Status = 'active' | 'disabled';

    interface MenuNode {
      id: string;
      code: string;
      name: string;
      sort: number;
      children: MenuNode[];
    }

    interface Item {
      id: string;
      name: string;
      remark: string | null;
      status: Status;
      createdAt: string;
      updatedAt: string;
      menuCodes?: string[];
    }

    interface ListQuery {
      page?: number;
      pageSize?: number;
      keyword?: string;
      status?: Status;
    }

    interface ListResp {
      items: Item[];
      total: number;
      page: number;
      pageSize: number;
    }
  }
}
