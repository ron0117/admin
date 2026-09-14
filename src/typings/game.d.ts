declare namespace GameType {
  /**
   * 游戏类别类型
   * - all: 全部
   * - slot: 老虎机
   * - video: 视频
   * - chess: 棋牌
   * - pachinko: 弹珠
   * - fish: 捕鱼
   * - electronic: 电子
   */
  type GameCategoryType = 'all' | 'slot' | 'video' | 'chess' | 'pachinko' | 'fish' | 'electronic';

  /**
   * 游戏发行商类型
   * - ag: 浩天游戏
   * - tb: 台北浩天游戏
   * - agfish: 浩天捕魚機
   * - evo: EVO
   * - ab: 欧博AllBet
   * - atg: ATG
   * - rsg: RSG
   * - wow: WOW
   */
  type GameProviderType = 'ag' | 'tb' | 'agfish' | 'evo' | 'ab' | 'atg' | 'rsg' | 'wow';

  /**
   * 游戏子发行商类型
   * - ag_slot: 浩天老虎机
   * - ag_video: 浩天视频
   * - ag_fish: 浩天捕鱼
   * - tb_chess: 台北浩天棋牌
   * - tb_fish: 台北浩天捕鱼
   * - evo: EVO
   * - ab: 欧博AllBet
   * - atg: ATG
   * - rsg: RSG
   * - wow: WOW
   */
  type GameSubProviderType =
    | 'ag_slot'
    | 'ag_video'
    | 'ag_fish'
    | 'tb_chess'
    | 'tb_fish'
    | 'evo'
    | 'ab'
    | 'atg'
    | 'rsg'
    | 'wow';

  /**
   * 机台卡别类型
   * - normal: 一般
   * - gold: 黄金
   * - diamond: 钻石
   * - vip: VIP
   * - generally: 体验
   */
  type MachineCardType = 'normal' | 'gold' | 'diamond' | 'vip' | 'generally';

  /**
   * 机台状态类型
   * - free: 空闲
   * - online: 游戏中
   * - retained: 保留座
   */
  type MachineStatusType = 'free' | 'online' | 'retained';

  /**
   * 入口设定类型
   * - hall: 大厅
   * - table: 桌台
   * - area: 区域
   * - game: 游戏
   */
  type GameEntryType = 'hall' | 'table' | 'area' | 'game';

  /**
   * 立即玩设定类型
   * - 1: 遊戲發行商 Evolution 進入EVO大厅
   * - 2: 遊戲發行商 Evolution 進入指定的遊戲類別
   * - 3: 遊戲發行商 Evolution 進入指定的游戏桌子的桌號
   */
  type GameImmediatePlayType = 1 | 2 | 3;

  /**
   * 显示条件类型
   * - 1: skin1
   * - 2: skin2
   * - 3: skin3
   */
  type GameSkinType = 1 | 2 | 3;

  /**
   * RSG 彩金档位
   * - 0: GRAND
   * - 1: MAJOR
   * - 2: MINOR
   * - 3: MINI
   */
  type RsgJackpotType = 0 | 1 | 2 | 3;
}
