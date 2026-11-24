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
      skillPrompt: string;
      updatedAt: string;
      specs: Spec[];
    }

    interface FeatureListResp {
      items: Feature[];
    }

    interface PatchFeatureReq {
      remark?: string;
      skillPrompt?: string;
      specs: Array<{ specKey: string; unitPoints: number }>;
    }

    type LedgerType = 'consume' | 'refund' | 'admin_increase' | 'admin_decrease' | 'recharge';
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
      roles: string[];
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

    interface StatsQuery {
      from?: string;
      to?: string;
    }

    interface StatsUser {
      userId: string;
      username: string | null;
      email: string;
      displayName: string;
      roles: string[];
      netPoints: number;
      consumeCount: number;
    }

    interface StatsRole {
      roleId: string | null;
      name: string;
      unassigned: boolean;
      status: 'active' | 'disabled' | null;
      netPoints: number;
      consumeCount: number;
      userCount: number;
    }

    interface StatsFeature {
      menuCode: string;
      name: string;
      known: boolean;
      sort: number;
      netPoints: number;
      consumeCount: number;
    }

    interface StatsResp {
      total: number;
      from: string | null;
      to: string | null;
      byUser: StatsUser[];
      byRole: StatsRole[];
      byFeature: StatsFeature[];
    }

    interface StatsUsersQuery extends StatsQuery {
      keyword?: string;
      page?: number;
      pageSize?: number;
    }

    interface StatsUsersResp {
      items: StatsUser[];
      total: number;
      page: number;
      pageSize: number;
    }
  }
}
