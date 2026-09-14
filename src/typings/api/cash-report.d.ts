declare namespace Api {
  namespace CashReport {
    /** 现金报告分页数据 */
    type PadminCashReportPageItem = {
      account?: string;
      billin?: number;
      boUserName?: string;
      boin?: number;
      boout?: number;
      /** 晶片入（Card in） */
      cardin?: number;
      /** 晶片出（Card out） */
      cardout?: number;
      createdAt?: string;
      keyin?: number;
      keyout?: number;
      machineNumber?: string;
      burstout?: string;
      meta?: {
        balance?: string;
        swallow?: string;
      };
    };

    /** 现金报告分页请求 */
    type PadminCashReportPageReq = {
      action?: string[];
      endTime?: string | null;
      machineNumber?: number;
      pageIndex?: number;
      pageSize?: number;
      proxy?: string;
      startTime?: string | null;
      storeIds?: string[];
    };

    /** 现金报告分页响应 */
    type PadminCashReportPageResp = {
      list?: PadminCashReportPageItem[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    };

    /** 现金报告汇总响应 */
    type PadminCashReportTotalResp = {
      /** 入点合计（keyin+billin+boin） */
      input?: number;
      /** 出点合计（keyout+boout） */
      output?: number;
      /** 营收 = input - output */
      revenue?: number;
    };

    /** 机台查询-总表（与分页请求字段一致） */
    type CashReportUserTotalResp = PadminCashReportTotalResp & {
      boUserName?: string;
      machineNumber?: string;
    };

    /**
     * 店家金流记录总表-按机台/店家分项（与 zjh `PadminCashReportMachineTotalItem` 一致）
     */
    type CashReportMachineTotalItem = {
      input?: number;
      machineNumber?: number;
      output?: number;
      revenue?: number;
      /** 台面余额（分项或店家汇总；与接口分项字段对齐） */
      balance?: number | string;
      storeName?: string;
      /** 店家展示编号（必有） */
      displayId: number;
    };

    /**
     * 店家金流记录总表响应（与 zjh `PadminCashReportTotalResp`、接口 `/cash/report/store/summary/total` 一致）
     */
    type CashReportStoreSummaryTotalResp = {
      /** 入点合计（keyin+billin+boin+cardin） */
      input?: string;
      machineNumber?: number;
      /** 分项（机台/店家） */
      machineTotals?: CashReportMachineTotalItem[];
      /** 出点合计（keyout+boout+cardout） */
      output?: string;
      /** 营收 = input - output（总表末列合并展示） */
      revenue?: string;
      /** 汇总范围内仅有一个用户时：店家名 */
      storeName?: string;
      /** displayId */
      displayId: number;
    };

    /**
     * 店家金流记录总表请求（与 zjh `PadminCashReportTotalReq` 一致）
     */
    type CashReportStoreSummaryReq = {
      action?: string[];
      endTime?: string | null;
      machineNumber?: number;
      name?: string;
      proxy?: string;
      startTime?: string | null;
      storeIds?: string[];
    };

    /** 店家查询-金流记录总表 台面余额请求 */
    type CashReportStoreSummaryBalanceReq = {
      storeIds?: string[];
      endTime?: string | null;
    };

    /** 店家查询-金流记录总表 台面余额响应 */
    type CashReportStoreSummaryBalanceResp = {
      /** 只有在单选店家时才会有值 */
      machineBalances?: CashReportMachineBalanceItem[];
      /** 只有在多选店家时才会有值 */
      storeBalances?: CashReportMachineBalanceItem[];
    };

    /** 店家查询-金流记录总表 台面余额机台余额 */
    type CashReportMachineBalanceItem = {
      storeName?: string;
      displayId: number;
      machineNumber?: number;
      balance?: number | string;
    };
  }
}
