/**
 * 游戏管理 - 平台设定模板（与 zjh `PadminGameGroupTemplate*` 对齐）
 * 路径前缀：`/game/setting/template`
 */
declare namespace Api {
  namespace GameTemplate {
    /** 查询模板默认游戏列表请求 */
    type TemplateDefaultListReq = {
      brandID?: number;
      category?: string;
      clientType?: number;
      dataType?: 0 | 1;
      gameID?: number;
      groupType?: 1 | 2;
      isPopular?: number;
      pageIndex?: number;
      pageSize?: number;
      status?: number;
      storeID?: string;
    };

    /** 查询平台设定模板列表请求 */
    type TemplateListReq = {
      /** 模板名称（模糊） */
      name?: string;
      /** 客户端类型 */
      clientType?: number;
      /** 状态：0=未发布，1=已发布 */
      status?: number;
    };

    /** 平台设定模板列表项 */
    type TemplateListItem = {
      clientType?: number;
      displayCount?: number;
      name?: string;
      popularCount?: number;
      status?: number;
      storeIds?: string[];
      templateId?: number;
      updatedAt?: string;
    };

    /** 查询平台设定模板列表响应 */
    type TemplateListResp = {
      items?: TemplateListItem[];
    };

    /** 发布平台设定模板到店家请求 */
    type TemplateReleaseReq = {
      /** @minItems 1 */
      storeIds: string[];
      templateId: number;
    };

    type TemplateReleaseResp = object;

    /** 保存平台设定模板请求 */
    type TemplateSaveReq = {
      boUserId?: string;
      clientType?: number;
      /** @minItems 1 */
      gameGroups: Api.GameManage.PadminGameGroup[];
      name: string;
      templateId?: number;
    };

    /** 保存平台设定模板响应 */
    type TemplateSaveResp = {
      templateId?: number;
    };

    /** 保存店家平台设定模板绑定关系请求 */
    type TemplateSaveMapReq = {
      /** @minItems 1 */
      storeIds: string[];
      templateId: number;
      clientType: number;
    };

    type TemplateSaveMapResp = object;

    type TemplateDetailResp = {
      gameGroups?: Api.GameManage.PadminGameGroupInfo[];
    };

    type TemplateMapResp = {
      storeIds: string[];
      occupiedStoreIds: string[];
    };

    type TemplateMapReq = {
      templateId: number;
      clientType: number;
    };

    /** 删除平台设定模板请求 */
    type TemplateDeleteReq = {
      templateId: number;
    };

    type TemplateDeleteResp = object;
  }
}
