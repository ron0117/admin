declare namespace Api {
  namespace IpBlocklist {
    type Status = 'ACTIVE' | 'EXPIRED' | 'UNBLOCKED';

    interface AdminRef { email: string }

    interface Item {
      id: string;
      network: string;
      status: 'ACTIVE' | 'UNBLOCKED';
      effectiveStatus: Status;
      reason: string;
      remark: string | null;
      source: string;
      expiresAt: string | null;
      hitCount: number;
      firstHitAt: string | null;
      lastHitAt: string | null;
      createdAt: string;
      updatedAt: string;
      unblockedAt: string | null;
      unblockReason: string | null;
      createdByAdmin?: AdminRef | null;
      updatedByAdmin?: AdminRef | null;
      unblockedByAdmin?: AdminRef | null;
    }

    interface ListQuery { keyword?: string; status?: Status; page?: number; pageSize?: number }
    interface ListResp { items: Item[]; total: number; page: number; pageSize: number }
    interface CreatePayload { network: string; reason: string; remark?: string; expiresAt?: string }
    type UpdatePayload = Omit<Partial<CreatePayload>, 'expiresAt'> & { expiresAt?: string | null };
    interface ReblockPayload { reason?: string; expiresAt?: string | null }
  }
}
