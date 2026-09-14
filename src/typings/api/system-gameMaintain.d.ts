declare namespace Api {
  namespace SystemGameMaintain {
    interface PcenterGameQueryRPCReq {
      category?: string;
      gameID?: number;
      pageIndex?: number;
      pageSize?: number;
    }

    export type SharedvoJSONGameIcon = object;

    export type SharedvoJSONGameMachinePresets = object;

    export type SharedvoJSONGameMeta = object;

    interface PcenterRPCGame {
      /** 游戏类别 */
      category?: string;
      /** 特性 */
      features?: number[];
      /** 游戏经验倍率 */
      gameExp?: number;
      /** 游戏图标 */
      gameIcon?: SharedvoJSONGameIcon;
      gameId?: number;
      /** 游戏玩法 */
      gamePlays?: number[];
      /** 游戏类型 */
      gameType?: string;
      /** 游戏机台配置 */
      machine?: SharedvoJSONGameMachinePresets;
      /** 维护时间 */
      maintain?: string;
      /** 游戏元数据 */
      meta?: SharedvoJSONGameMeta;
      /** 游戏名称 */
      name?: string;
      /** 游戏发行商 */
      provider?: string;
      /** 3rd游戏ID */
      providerGameId?: string;
      /** 客户端接入方式 */
      subProvider?: string;
      /** 是否是网页游戏 */
      web?: boolean;
    }

    interface PcenterGameQueryRPCResp {
      games?: PcenterRPCGame[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    }

    interface startStopMaintainReq {
      boUserId?: string;
      /** 游戏ids */
      gameIds: number[];
      /** 是否不从游戏中提出 */
      notKick?: boolean;
    }

    interface JobsGameMaintainPayload {
      /** 动作 开启或者关闭 */
      action?: 'start' | 'stop';
      /** 维护游戏id */
      gameIds?: number[];
      /** 是否不踢人 */
      notKick?: boolean;
    }

    interface gameMaintainJobCreateReq {
      /** 执行时间 */
      executeTime: string;
      /** 游戏维护 */
      gameMaintain?: JobsGameMaintainPayload;
      /** 任务类型 */
      jobType: number;
    }

    interface gameMaintainJobListReq {
      /** 审核状态 */
      auditState?: number;
      /** 执行时间 */
      executeTimeEnd?: string;
      /** 执行时间 */
      executeTimeStart?: string;
      /** 任务类型 */
      jobType?: number;
      /** 任务类型数组 */
      jobTypes?: number[];
      pageIndex?: number;
      pageSize?: number;
      /** 数据 */
      payloadLike?: string;
      /** 任务状态 */
      state?: number;
    }

    type DatatypesJSONMap = Record<string, any>;
    interface DtoJobInfoDTO {
      adminName?: string;
      /** 审批人id */
      auditBoUserId?: string;
      auditName?: string;
      /** 审核状态 */
      auditState?: number;
      /** 创建人id */
      boUserId?: string;
      /** 创建时间 */
      createdAt?: string;
      depositsCategoryId?: number;
      depositsGroupId?: number;
      /** 执行时间 */
      executeTime?: string;
      /** 任务id */
      id?: number;
      /** 任务名称 */
      name?: string;
      /** 数据 */
      payload?: DatatypesJSONMap;
      /** 执行结果 */
      result?: DatatypesJSONMap;
      /** 任务状态 */
      state?: number;
      /** 任务类型 */
      type?: number;
    }

    interface DtoJobListQueryResp {
      jobs?: DtoJobInfoDTO[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    }

    interface gameMaintainOperationLogReq {
      pageIndex?: number;
      pageSize?: number;
      timeEnd?: string;
      timeStart?: string;
      modules?: string[];
    }

    interface DtoJobLogInfo {
      action: 'start' | 'stop';
      adminName?: string;
      afterValue?: DtoJobInfoDTO;
      beforeValue?: DtoJobInfoDTO;
      boUserId?: string;
      comment?: string;
      id?: number;
      module?: string;
      updatedAt?: string;
    }

    interface gameMaintainOperationLogResp {
      logs?: DtoJobLogInfo[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    }
  }
}
