import type { BatchTaskContext, GameTemplatePublishPayload } from '@/store/modules/batch/index';
import type {
  BatchFinishResult,
  BatchProgressItem,
  BatchProgressRunner
} from '@/components/custom/batch-progress-dialog.vue';
import type { BatchTaskType } from '@/enum/batch';

export interface WindowBatch {
  isRunning: (type?: BatchTaskType) => boolean;
  getActiveTask: () => BatchTaskContext;
  startGameTemplatePublish: (payload: GameTemplatePublishPayload) => Promise<BatchFinishResult | null>;
  resetTask: () => void;
}

export type { BatchFinishResult, BatchProgressItem, BatchProgressRunner, BatchTaskContext, GameTemplatePublishPayload };
