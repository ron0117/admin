declare namespace Api {
  namespace Recharge {
    type Package = {
      id: string;
      amountCents: number;
      basePoints: number;
      bonusPoints: number;
      totalPoints: number;
      onShelf: boolean;
      sort: number;
      createdAt: string;
      updatedAt: string;
    };

    type PackageListResp = { items: Package[] };

    type CreatePackageReq = {
      amountCents: number;
      basePoints: number;
      bonusPoints?: number;
      onShelf?: boolean;
      sort?: number;
    };

    type PatchPackageReq = Partial<CreatePackageReq>;

    type OrderStatus = 'pending' | 'paid' | 'failed' | 'closed';

    type Order = {
      id: string;
      userId: string;
      packageId: string;
      orderNo: string;
      pingppChargeId: string | null;
      amountCents: number;
      feeCents: number;
      netCents: number;
      pointsCredited: number;
      status: OrderStatus;
      payUrl: string | null;
      paidAt: string | null;
      expiresAt: string;
      createdAt: string;
      userEmail?: string;
      userUsername: string | null;
    };

    type OrderListQuery = {
      page?: number;
      pageSize?: number;
      userId?: string;
      status?: OrderStatus;
      from?: string;
      to?: string;
    };

    type OrderListResp = {
      items: Order[];
      total: number;
      page: number;
      pageSize: number;
    };

    type CardStatus = 'unused' | 'redeemed';

    type Card = {
      id: string;
      code: string;
      points: number;
      status: CardStatus;
      batchNote: string | null;
      createdAt: string;
      redeemedAt: string | null;
      redeemedUserId: string | null;
      redeemedUserEmail: string | null;
      redeemedUserUsername: string | null;
    };

    type CardListQuery = {
      page?: number;
      pageSize?: number;
      status?: CardStatus;
      points?: number;
      codeKeyword?: string;
      redeemedUserId?: string;
      createdFrom?: string;
      createdTo?: string;
    };

    type CardListResp = {
      items: Card[];
      total: number;
      page: number;
      pageSize: number;
    };

    type GenerateCardsReq = {
      count: number;
      points: number;
      batchNote?: string;
    };

    type GenerateCardsResp = { created: number };

    type ShopConfigResp = {
      shopUrl: string | null;
      updatedAt: string | null;
    };

    type PatchShopConfigReq = {
      shopUrl: string;
    };
  }
}
