declare namespace Api.GameMarquee {
  type GameMarqueeType = 'bigWin' | 'supreme' | 'grand' | 'mega' | 'major' | 'minor' | 'mini';
  type GameMarqueeStatus = 'pending' | 'running' | 'finished';
  type GameMarqueeCategory = 'normal' | 'maintain' | 'activity' | 'game';
  type GameCategory = 'slot' | 'video' | 'chess' | 'pachinko' | 'fish' | 'electronic' | 'all';

  // list请求参数
  type PadminMarqueeListReq = {
    pageIndex?: number;
    pageSize?: number;
    /** 起始时间大于等于 */
    startAtGte?: string;
    /** 起始时间小于等于 */
    startAtLte?: string;
    /** 状态 */
    status?: GameMarqueeStatus;
    /** 类型 */
    type?: GameMarqueeType;
  };

  // list响应
  type PadminGameMarqueeSettingResp = {
    settings?: PadminGameMarqueeSetting[];
  };

  type PadminGameMarqueeSetting = {
    bigWinConditions?: SettingMarqueeBigWinCondition[];
    category?: GameCategory;
    templates?: PadminMarqueeTemplate[];
  };

  type SettingMarqueeBigWinCondition = {
    /** 最低倍率 */
    minRate?: number;
    /** 最低赢分 */
    minWin?: number;
    type?: GameMarqueeType;
  };

  type PadminMarqueeTemplate = {
    content: Record<string, string>;
    gameMarqueeType: GameMarqueeType;
    templateType: 'jp' | 'game' | 'maintain' | 'urgent';
  };
}
