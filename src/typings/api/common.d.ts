/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** page index */
      pageIndex: number;
      /** page size */
      pageSize: number;
      /** total count */
      totalCount: number;
      /** games */
      games?: Api.GameManage.Game[];
      /** machines */
      machines?: Api.GameManage.MachineList[];
      /** list */
      list?: any[];
      currentPage?: number;
    }

    /**
     * common response for flat request
     * - success: { data: T, error: null }
     * - fail: { data: null, error: AxiosError }
     */
    type RecordResponse<T = any> = {
      data: null | T;
      error: null | import('axios').AxiosError;
    } & T;

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'pageIndex' | 'pageSize'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | undefined;
    } & T;
  }
}
