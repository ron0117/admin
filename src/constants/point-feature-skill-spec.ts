/** 各功能 skill 分段与占位符说明（展示在 textarea 外，不入库） */

export type SkillSectionSpec = {
  key: string;
  title: string;
  params: Array<{ key: string; label: string }>;
};

export type MenuSkillSpec = {
  menuCode: string;
  hint: string;
  sections: SkillSectionSpec[];
};

export const MENU_SKILL_SPECS: MenuSkillSpec[] = [
  {
    menuCode: 'generate.create.inspire',
    hint: '单段【generate】；正文用 ${变量}，下方列表为客户端自动填入项。',
    sections: [
      {
        key: 'generate',
        title: '生图',
        params: [
          { key: 'category', label: '品类' },
          { key: 'ratio', label: '画面比例' },
          { key: 'outfitLine', label: '服装参考说明' },
          { key: 'backgroundDesc', label: '背景策略' },
          { key: 'poseDesc', label: '姿势策略' },
          { key: 'modelDesc', label: '模特策略' },
          { key: 'clothingDesc', label: '服装策略' }
        ]
      }
    ]
  },
  {
    menuCode: 'generate.create.scene-renew',
    hint: '单段【generate】。',
    sections: [
      {
        key: 'generate',
        title: '生图',
        params: [
          { key: 'category', label: '品类' },
          { key: 'ratio', label: '画面比例' }
        ]
      }
    ]
  },
  {
    menuCode: 'generate.create.free',
    hint: '单段【generate】；通常正文为 ${userPrompt}。',
    sections: [{ key: 'generate', title: '生图', params: [{ key: 'userPrompt', label: '用户创意描述' }] }]
  },
  {
    menuCode: 'generate.create.fission',
    hint: '须含【analyze】【batch】【smartCrop】三段。',
    sections: [
      {
        key: 'analyze',
        title: '识图分析',
        params: [
          { key: 'marker', label: '识图标记' },
          { key: 'category', label: '品类' },
          { key: 'ratio', label: '画面比例' },
          { key: 'count', label: '本轮张数' },
          { key: 'start', label: '起始序号' },
          { key: 'dimHint', label: '差异维度说明' },
          { key: 'coreGuard', label: '保核约束' },
          { key: 'indexRange', label: 'index 区间' }
        ]
      },
      {
        key: 'batch',
        title: '批量生图',
        params: [
          { key: 'category', label: '品类' },
          { key: 'ratio', label: '画面比例' },
          { key: 'variantCount', label: '张数' },
          { key: 'variantLines', label: '变体指令列表' },
          { key: 'summaryBlock', label: '识图摘要块' },
          { key: 'coreGuard', label: '保核约束' }
        ]
      },
      {
        key: 'smartCrop',
        title: '智能主体裁剪识图',
        params: [
          { key: 'marker', label: '识图标记' },
          { key: 'ratioHint', label: '目标比例说明' }
        ]
      }
    ]
  },
  {
    menuCode: 'generate.create.live',
    hint: '须含【motionChat】与【i2v】。',
    sections: [
      {
        key: 'motionChat',
        title: 'AI Motion Chat',
        params: [
          { key: 'marker', label: 'Chat 标记' },
          { key: 'duration', label: '时长（秒）' },
          { key: 'ratio', label: '画面比例' },
          { key: 'seed', label: '预设种子' }
        ]
      },
      {
        key: 'i2v',
        title: '图生视频',
        params: [{ key: 'motionPrompt', label: '运动描述正文' }]
      }
    ]
  }
];

export function skillSpecForMenu(menuCode: string): MenuSkillSpec | undefined {
  return MENU_SKILL_SPECS.find(item => item.menuCode === menuCode);
}
