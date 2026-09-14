/** 批量任务类型 */
export enum BatchTaskType {
  None = 'none',
  /** 模板批量发布到店家 */
  GameTemplatePublish = 'game_template_publish'
}

/** 批量任务状态 */
export enum BatchTaskStatus {
  Idle = 'idle',
  Running = 'running',
  Done = 'done'
}
