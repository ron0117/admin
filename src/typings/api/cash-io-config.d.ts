declare namespace Api {
  namespace CashIoConfig {
    type PadminIoConfig = {
      keyInEnable?: boolean;
      keyInUnit?: number;
      keyInUnitBig?: number;
      keyOutEnable?: boolean;
      keyOutUnit?: number;
    };

    type PadminIoConfigDetailReq = {
      boUserId: string;
    };

    type PadminIoConfigDetailResp = {
      /** 配置详情 */
      config?: PadminIoConfig;
    };

    type PadminIoConfigUpdateReq = {
      boUserId: string;
      keyInEnable?: boolean;
      keyInUnit?: number;
      keyInUnitBig?: number;
      keyOutEnable?: boolean;
      keyOutUnit?: number;
    };

    type PadminIoConfigUpdateResp = object;

    /** 更新爆机上限 */
    type PadminIoBrustUpdateReq = {
      storeId: string;
      enabled: boolean;
      upperLimit: number;
    };

    type PadminIoBrustUpdateResp = object;

    type PadminIoBrustDetailReq = {
      storeId: string;
    };

    type PadminIoBrustDetailResp = {
      enabled?: boolean;
      upperLimit?: string;
    };

    type PadminIoBrustDTO = {
      enabled: boolean;
      upperLimit: number;
    };
  }
}
