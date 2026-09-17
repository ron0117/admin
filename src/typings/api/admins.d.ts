declare namespace Api {
  namespace Admin {
    type Status = 'active' | 'disabled';

    interface Item {
      id: string;
      email: string;
      username: string | null;
      status: Status;
      createdAt: string;
      updatedAt: string;
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
