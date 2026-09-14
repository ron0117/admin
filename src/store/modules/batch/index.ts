import { ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  BatchFinishResult,
  BatchProgressItem,
  BatchProgressRunner,
  BatchStartOptions
} from '@/components/custom/batch-progress-dialog.vue';
import { BatchTaskStatus, BatchTaskType } from '@/enum/batch';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';

/** 当前批量任务上下文 */
export type BatchTaskContext = {
  type: BatchTaskType;
  status: BatchTaskStatus;
  templateId?: number;
  clientType?: number;
};

export type BatchExecutor = {
  start: (
    items: BatchProgressItem[],
    runner: BatchProgressRunner,
    options?: BatchStartOptions
  ) => Promise<BatchFinishResult | null>;
};

/** 仅以下类型同一时刻只允许一个实例在跑 */
const SINGLE_INSTANCE_TASK_TYPES = new Set<BatchTaskType>([BatchTaskType.GameTemplatePublish]);

export type GameTemplatePublishPayload = {
  templateId: number;
  clientType: number;
  items: BatchProgressItem[];
  runner: BatchProgressRunner;
  batchSize?: number;
};

export const useBatchStore = defineStore(SetupStoreId.Batch, () => {
  const activeTask = ref<BatchTaskContext>({
    type: BatchTaskType.None,
    status: BatchTaskStatus.Idle
  });

  let executor: BatchExecutor | null = null;

  const registerExecutor = (impl: BatchExecutor) => {
    executor = impl;
  };

  const isRunning = (type?: BatchTaskType) => {
    if (activeTask.value.status !== BatchTaskStatus.Running) {
      return false;
    }
    if (!type) {
      return activeTask.value.type !== BatchTaskType.None;
    }
    return activeTask.value.type === type;
  };

  const canStart = (type: BatchTaskType) => {
    if (!SINGLE_INSTANCE_TASK_TYPES.has(type)) {
      return true;
    }
    return !isRunning(type);
  };

  const resetTask = () => {
    activeTask.value = {
      type: BatchTaskType.None,
      status: BatchTaskStatus.Idle
    };
  };

  /** 模板批量发布 */
  const startGameTemplatePublish = async (payload: GameTemplatePublishPayload) => {
    if (!canStart(BatchTaskType.GameTemplatePublish)) {
      window.$message?.warning($t('page.game.template.publishInProgress'));
      return null;
    }
    if (!executor) {
      return null;
    }

    activeTask.value = {
      type: BatchTaskType.GameTemplatePublish,
      status: BatchTaskStatus.Running,
      templateId: payload.templateId,
      clientType: payload.clientType
    };

    const result = await executor.start(payload.items, payload.runner, {
      taskType: BatchTaskType.GameTemplatePublish,
      batchSize: payload.batchSize ?? 5
    });

    activeTask.value = {
      ...activeTask.value,
      status: BatchTaskStatus.Done
    };

    return result;
  };

  /** 指定模板是否正在批量发布 */
  const isGameTemplatePublishing = (templateId?: number) =>
    isRunning(BatchTaskType.GameTemplatePublish) && activeTask.value.templateId === templateId;

  return {
    activeTask,
    registerExecutor,
    isRunning,
    canStart,
    resetTask,
    startGameTemplatePublish,
    isGameTemplatePublishing
  };
});
