import { skillSpecForMenu } from './point-feature-skill-spec';

export function skillHintForMenu(menuCode: string): string {
  return skillSpecForMenu(menuCode)?.hint ?? '正文使用 ${变量} 占位；可用参数见下方列表。';
}
