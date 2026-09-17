declare namespace Api {
  namespace Points {
    interface Spec {
      specKey: string;
      specLabel: string;
      unitPoints: number;
    }

    interface Feature {
      id: string;
      menuCode: string;
      name: string;
      remark: string;
      updatedAt: string;
      specs: Spec[];
    }

    interface FeatureListResp {
      items: Feature[];
    }

    interface PatchFeatureReq {
      remark?: string;
      specs: Array<{ specKey: string; unitPoints: number }>;
    }

    type LedgerType = 'consume' | 'refund' | 'admin_increase' | 'admin_decrease';
    type LedgerStatus = 'pending' | 'completed' | 'refunded';

    interface Ledger {
      id: string;
      createdAt: string;
      type: LedgerType;
      status: LedgerStatus;
      requestId: string | null;
      menuCode: string | null;
      specKey: string | null;
      unitPoints: number | null;
      quantity: number | null;
      amount: number;
      balanceAfter: number;
      remark: string | null;
      email: string;
      username: string | null;
    }

    interface LedgerListQuery {
      page?: number;
      pageSize?: number;
      keyword?: string;
      type?: LedgerType;
      menuCode?: string;
      status?: LedgerStatus;
      from?: string;
      to?: string;
    }

    interface LedgerListResp {
      items: Ledger[];
      total: number;
      page: number;
      pageSize: number;
    }

    type AdjustDirection = 'increase' | 'decrease';

    interface AdjustReq {
      direction: AdjustDirection;
      amount: number;
      remark: string;
    }

    interface AdjustResp {
      points: number;
    }
  }
}
