/**
 * 游戏厂牌（Game Brand）
 *
 * - **P1b**：与 `src/service/api/game-brand.ts` 一一对应：`list` / `create` / `update` / `delete`；无 detail；**更新**请求体为 `{ list: [...] }`（批量），排序拖拽提交多条 `id`+`sort`，编辑名称/icon 可提交单条或多条。
 * - 路径与字段以后端 Swagger 为准；变更时请同步 `docs/design/技术设计-新增游戏厂牌+功能.md`
 */
declare namespace Api {
  namespace GameBrand {
    /** 厂牌多语小图标，与 `I18nImage` / `game-operate-modal` 的 iconSmall 结构一致 */
    type GameBrandIcons = Record<GlobalLangType, string | CommonType.I18nResourceConfig>;

    /** 列表单条（字段与后端一致即可用于「查看」，不单独请求 detail） */
    type GameBrandListItem = {
      id: number;
      /** 排序权重，越小越靠前或依后端约定 */
      sort: number;
      /** 多语名称 */
      name: Record<GlobalLangType, string>;
      icons: GameBrandIcons;
      /** 启用状态；首版后端若无此字段可为空 */
      status?: number;
      /** 最后修改者账号或昵称 */
      lastEditor?: string;
      updateBy?: string;
      updateTime?: string;
      iconsNew: GameBrandIcons;
    };

    type GameBrandListParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        /** 按厂牌 id 筛选 */
        brandId?: number;
        /** 启用/停用 */
        status?: Common.EnableStatus;
        /** 名称关键字（依后端） */
        keyword?: string;
      }
    >;

    type GameBrandListResp = {
      items: GameBrandListItem[];
    };

    /** 新增单条 */
    type GameBrandCreateReq = {
      name: Record<GlobalLangType, string>;
      icons: GameBrandIcons;
      iconsNew: GameBrandIcons;
    };

    /**
     * 批量更新中的单条：须含 `id`；可仅含 `sort`（排序）、或含 `name`/`icons` 等字段做内容更新
     * 与 `POST .../game-brand/update` 请求体中的 `list` 元素一致
     */
    type GameBrandUpdateListItem = {
      id: number;
      sort?: number;
      name?: Record<GlobalLangType, string>;
      icons?: GameBrandIcons;
      status?: Common.EnableStatus;
      iconsNew?: GameBrandIcons;
    };

    /**
     * 更新（含改排序）：请求体为 `{ list: [...] }`，排序拖拽后批量提交多条 `id`+`sort`
     */
    type GameBrandUpdateReq = {
      list: GameBrandUpdateListItem[];
    };

    type GameBrandDeleteReq = {
      id: number;
    };

    /**
     * 平台/首页：「游戏类型 + 厂牌」Tab 与预设分页
     * 写入系统「平台参数」时的 value JSON 语义（category/name 与后端约定）
     */
    type PlatformHomeDefaultTab = {
      gameCategory: string;
      brandId: number;
    };

    type PlatformHomeBrandTabItem = {
      brandId: number;
      visible: boolean;
      order: number;
    };

    type PlatformHomeCategoryBrands = {
      brands: PlatformHomeBrandTabItem[];
    };

    /** 与 `技术设计` 4.3 节示例一致，键名可随 P0 调整 */
    type PlatformHomeGameBrandConfig = {
      defaultTab: PlatformHomeDefaultTab;
      categories: Record<string, PlatformHomeCategoryBrands>;
    };

    /**
     * 平台参数一条记录中 value 的形态（若后端存字符串则先 JSON.parse）
     * 示例 category：`platform.home`；name：`gameBrandTabs`（均为示例）
     */
    type PlatformHomeGameBrandParamValue = PlatformHomeGameBrandConfig | string;
  }
}
