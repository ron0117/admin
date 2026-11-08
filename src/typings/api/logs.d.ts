declare namespace Api {
  namespace Logs {
    type Status = 'ok' | 'disabled' | 'down';

    type Channel = 'http' | 'business' | 'error' | 'database' | 'security' | 'none';

    type Level = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

    interface Item {
      id: string;
      createdAt: string;
      level: string;
      channel: string | null;
      message: string;
      requestId: string | null;
      clientVersion: string | null;
      context: string | null;
      service: string;
      payload: unknown;
    }

    interface ListQuery {
      from: string;
      to: string;
      level?: Level;
      channel?: Channel;
      requestId?: string;
      clientVersion?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
    }

    interface ListResp {
      status: Status;
      items: Item[];
      total: number;
      page: number;
      pageSize: number;
    }
  }
}
