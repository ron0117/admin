declare namespace Api.AnnounceMarquee {
  /** 公告跑马灯类型（本页固定为 normal） */
  type MarqueeType = 'normal' | 'activity' | 'game' | 'jp' | 'urgent' | 'maintain';

  type MarqueeStatus = 'pending' | 'running' | 'finished';

  interface MarqueeListReq {
    pageIndex?: number;
    pageSize?: number;
    startAtGte?: string;
    startAtLte?: string;
    status?: MarqueeStatus;
    type?: MarqueeType;
  }

  interface MarqueeListResp {
    pageIndex?: number;
    pageSize?: number;
    records?: MarqueeDTO[];
    totalCount?: number;
  }

  interface MarqueeDTO {
    marqueeId?: number;
    title?: Record<string, string>;
    content?: Record<string, string>;
    startAt?: string;
    endAt?: string;
    status?: MarqueeStatus;
    type?: MarqueeType;
    boUserName?: string;
  }

  interface MarqueeCreateReq {
    title: Record<string, string>;
    content: Record<string, string>;
    startAt: string;
    endAt: string;
    type: MarqueeType;
  }

  interface MarqueeUpdateReq extends MarqueeCreateReq {
    marqueeId: number;
  }

  interface MarqueeDeleteReq {
    marqueeId: number;
  }
}
