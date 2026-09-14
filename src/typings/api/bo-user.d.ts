declare namespace Api {
  namespace BoUser {
    enum EnumBoUserStatus {
      BoUserStatusActive = 'active',
      BoUserStatusInactive = 'inactive'
    }

    enum EnumBoAccountType {
      BoAccountTypeCommon = 'common',
      BoAccountTypeAPI = 'api',
      BoAccountTypeSuperAdmin = 'super admin'
    }

    /** 用户扩展元数据（如店铺押注群组） */
    interface PboBoUserMeta {
      /** ATG單機版押注群组 */
      atgOfflineBetGroup?: number;
      /** ATG彩金版押注群组 */
      atgOnlineBetGroup?: number;
      /** 彩金版押注群组 */
      onlineBetGroup?: number;
      /** 單機版押注群组 */
      offlineBetGroup?: number;
      /** 游戏RTP */
      rtp?: number;
      /** 游戏赢分 */
      winLimit?: number;
      /** RSG押注上下限 */
      rsgBetRange?: [number, number];
      /** WOW无彩金押注群組 */
      wowOfflineBetRange?: number;
      /** WOW有彩金押注群組 */
      wowOnlineBetRange?: number;
      /** standby */
      standby?: {
        carousel: boolean;
        enabled: boolean;
      };
    }

    interface PboBoUser {
      /** 账号类型 */
      accountType?: EnumBoAccountType;
      /** 部门ID */
      boDepartmentId?: string;
      /** 玩家ID */
      boUserId?: string;
      createdAt?: string;
      hierarchy?: string;
      /** Email */
      email?: string;
      /** 玩家昵称 */
      name?: string;
      /** 状态 */
      status?: 'active' | 'inactive';
      updatedAt?: string;
      password?: string;
      /** 角色ID列表 */
      boRoles?: string;
      /** LSID */
      lsid?: number;
      /** 扩展元数据；店铺押注群组见 meta.betGroup（1 低 / 2 高） */
      meta?: PboBoUserMeta;
      /** 角色名称，逗号分隔 */
      roleStr?: string;
      /** 店家ID */
      displayId?: string;
      /** db地址 */
      jpkDsn?: string;
      /** 游戏RTP */
      rtp?: number;
      /** 游戏赢分 */
      winLimit?: number;
    }

    /** 账号类型 */
    interface PboBoUserCreateReq {
      accountType?: EnumBoAccountType;
      /** 部门ID */
      boDepartmentId?: string;
      /** 角色ID列表 */
      boRoles?: string[];
      /** Email */
      email?: string;
      /** 玩家昵称 */
      name?: string;
      /** 密码 */
      password?: string;
      /** 层级 */
      hierarchy?: string;
      /** LSID */
      lsid?: number;
      /** 扩展元数据；店铺时必填 betGroup（1 低 / 2 高） */
      meta?: PboBoUserMeta;
      /** db地址 */
      jpkDsn?: string;
      /** 游戏RTP */
      rtp?: number;
      /** 游戏赢分 */
      winLimit?: number;
    }

    type PboBoUserCreateResp = object;

    interface PboBoUserDeleteReq {
      /** 玩家ID */
      boUserID: string;
    }

    type PboBoUserDeleteResp = object;

    interface PboBoUserDetailReq {
      /** 玩家ID */
      boUserID: string;
    }

    interface PboBoUserDetailResp {
      /** 账号类型 */
      accountType?: EnumBoAccountType;
      /** 部门ID */
      boDepartmentId?: string;
      /** 角色ID列表 */
      boRoles?: string[];
      /** 玩家ID */
      boUserId?: string;
      createdAt?: string;
      /** Email */
      email?: string;
      /** 玩家昵称 */
      name?: string;
      /** 状态 */
      status?: 'active' | 'inactive';
      updatedAt?: string;
      /** 层级 */
      hierarchy?: string;
      /** LSID */
      lsid?: number;
      /** 扩展元数据；店铺押注群组见 meta.betGroup（1 低 / 2 高） */
      meta?: PboBoUserMeta;
      /** db地址 */
      jpkDsn?: string;
    }

    interface PboBoUserPageReq {
      /** 部门ID */
      boDepartmentId?: string;
      /** 层级 */
      hierarchy?: string;
      /** Email */
      email?: string;
      /** 玩家昵称 */
      name?: string;
      pageIndex?: number;
      pageSize?: number;
      /** 排序字段时间 */
      sort?: string;
      /** 状态 */
      status?: string;
      /** 角色 */
      boRoleId?: string;
    }

    interface PboBoUserPageResp {
      /** 玩家列表 */
      boUsers: PboBoUser[];
      pageIndex: number;
      pageSize: number;
      totalCount: number;
    }

    interface PboBoUserUpdateReq {
      /** 账号类型 */
      accountType?: EnumBoAccountType;
      /** 部门ID */
      boDepartmentId?: string;
      /** 角色ID列表 */
      boRoles?: string[];
      /** 玩家ID */
      boUserId?: string;
      /** Email */
      email?: string;
      /** 玩家昵称 */
      name?: string;
      /** 密码（可选） */
      password?: string;
      /** 状态 */
      status?: 'active' | 'inactive';
      /** 层级 */
      hierarchy?: string;
      /** LSID */
      lsid?: number;
      /** 扩展元数据；店铺时含 betGroup（1 低 / 2 高） */
      meta?: PboBoUserMeta;
      /** db地址 */
      jpkDsn?: string;
      /** 游戏RTP */
      rtp?: number;
      /** 游戏赢分 */
      winLimit?: number;
    }

    type PboBoUserUpdateResp = object;

    type PboBoUserListReq = {
      /** boUsers */
      boUsers?: string;
      /** name */
      name?: string;
      /** hierarchy */
      hierarchy?: string;
    };

    type PboBoUserListResp = {
      boUsers?: PboBoUser[];
    };

    /** 押注区间群组配置（GET /bo/user/bet-group） */
    interface PboBoUserBetGroupResp {
      /** 押注区间群组枚举值列表 */
      value?: number[];
    }

    /** 店家 refresh / 维护方式 */
    enum EnumBoUserRefreshMode {
      BoUserRefreshModeManual = 'manual',
      BoUserRefreshModeAuto = 'auto'
    }

    /** 分页查询店家 restart 配置 */
    interface PboBoUserRefreshListReq {
      pageIndex?: number;
      pageSize?: number;
      /** 店家名称 */
      name?: string;
    }

    interface PboBoUserRefreshListItem {
      boUserId?: string;
      /** 倒计时（秒） */
      countDown?: number;
      mode?: EnumBoUserRefreshMode | 'manual' | 'auto';
      name?: string;
      /** 异动人员 */
      updatedBy?: string;
    }

    interface PboBoUserRefreshListResp {
      items?: PboBoUserRefreshListItem[];
      pageIndex?: number;
      pageSize?: number;
      totalCount?: number;
    }

    interface PboBoUserRefreshSaveItem {
      /** 被修改的店家 ID */
      boUserId: string;
      /** 倒计时（秒），默认 0 */
      countdown?: number;
      /** 刷新模式：manual/auto，默认 manual */
      mode?: EnumBoUserRefreshMode | 'manual' | 'auto';
    }

    interface PboBoUserRefreshSaveReq {
      items: PboBoUserRefreshSaveItem[];
    }

    type PboBoUserRefreshSaveResp = object;

    interface PboBoUserKickReq {
      machineId: number;
      gameId: number;
      userId: number;
    }

    interface PboBoUserClearReq {
      machineId: number;
      gameId: number;
    }
  }
}
