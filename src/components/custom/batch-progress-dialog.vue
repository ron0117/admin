<script setup lang="ts">
import { computed, reactive } from 'vue';
import { ElMessageBox } from 'element-plus';
import { BatchTaskType } from '@/enum/batch';
import { $t } from '@/locales';

defineOptions({ name: 'BatchProgressDialog' });

/** 单条任务 */
export type BatchProgressItem = {
  id: string;
  label: string;
};

/** 一批执行结果：有 error 则该批全部记为失败 */
export type BatchProgressRunner = (batch: BatchProgressItem[]) => Promise<{ error?: unknown } | undefined>;

export type BatchStartOptions = {
  taskType?: BatchTaskType;
  batchSize?: number;
  concurrent?: boolean;
  autoCloseOnSuccess?: boolean;
};

export type BatchFinishResult = {
  successIds: string[];
  failedItems: BatchProgressItem[];
  isRetry: boolean;
};

interface Props {
  /** 每批条数，默认 5 */
  batchSize?: number;
  /** true=多批并行；false=串行（默认） */
  concurrent?: boolean;
  /** 全成功后是否自动关闭，默认 true */
  autoCloseOnSuccess?: boolean;
  width?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  batchSize: 5,
  concurrent: false,
  autoCloseOnSuccess: true,
  width: '360px'
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'progress', payload: { success: number; failed: number; total: number; done: number }): void;
  (e: 'finish', payload: BatchFinishResult): void;
  (e: 'closed'): void;
}>();

const sessionOptions = reactive({
  taskType: BatchTaskType.None as BatchTaskType,
  batchSize: 5,
  concurrent: false,
  autoCloseOnSuccess: true
});

const TASK_TYPE_LABEL_KEY: Partial<Record<BatchTaskType, App.I18n.I18nKey>> = {
  [BatchTaskType.GameTemplatePublish]: 'common.batchProgress.taskType.gameTemplatePublish'
};

const state = reactive({
  visible: false,
  running: false,
  total: 0,
  success: 0,
  successIds: [] as string[],
  /** 当前轮次已累计的失败项（运行中也会增长） */
  roundFailed: [] as BatchProgressItem[],
  /** 上一轮结束后展示的失败列表 */
  failedItems: [] as BatchProgressItem[],
  isRetry: false,
  runner: null as BatchProgressRunner | null
});

const taskTypeLabel = computed(() => {
  const key = TASK_TYPE_LABEL_KEY[sessionOptions.taskType];
  return key ? $t(key) : '';
});
const effectiveBatchSize = computed(() => sessionOptions.batchSize || props.batchSize);
const effectiveConcurrent = computed(() => sessionOptions.concurrent ?? props.concurrent);
const effectiveAutoCloseOnSuccess = computed(() => sessionOptions.autoCloseOnSuccess ?? props.autoCloseOnSuccess);

const percent = computed(() => {
  if (!state.total) {
    return 0;
  }
  const done = state.success + state.roundFailed.length;
  return Math.min(100, Math.round((done / state.total) * 100));
});

const progressStatus = computed(() => {
  if (state.running) {
    return undefined;
  }
  if (state.failedItems.length) {
    return 'exception' as const;
  }
  if (state.success > 0 && state.success >= state.total) {
    return 'success' as const;
  }
  return undefined;
});

const chunkItems = (items: BatchProgressItem[]) => {
  const size = Math.max(1, effectiveBatchSize.value);
  const batches: BatchProgressItem[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
};

const emitProgress = () => {
  emit('progress', {
    success: state.success,
    failed: state.roundFailed.length,
    total: state.total,
    done: state.success + state.roundFailed.length
  });
};

const buildFinishResult = (): BatchFinishResult => ({
  successIds: [...state.successIds],
  failedItems: [...state.failedItems],
  isRetry: state.isRetry
});

const handleBatchResult = (batch: BatchProgressItem[], error?: unknown) => {
  if (error) {
    state.roundFailed.push(...batch);
  } else {
    state.success += batch.length;
    state.successIds.push(...batch.map(item => item.id));
  }
  emitProgress();
};

const runBatches = async (items: BatchProgressItem[]) => {
  const runner = state.runner;
  if (!runner || !items.length) {
    return;
  }
  const batches = chunkItems(items);

  if (effectiveConcurrent.value) {
    await Promise.all(
      batches.map(async batch => {
        const result = await runner(batch);
        handleBatchResult(batch, result?.error);
      })
    );
    return;
  }

  await batches.reduce(
    (prev, batch) =>
      prev.then(async () => {
        const result = await runner(batch);
        handleBatchResult(batch, result?.error);
      }),
    Promise.resolve()
  );
};

const finishRound = (): BatchFinishResult => {
  state.failedItems = [...state.roundFailed];
  state.running = false;
  const result = buildFinishResult();
  emit('finish', result);
  if (!state.failedItems.length && effectiveAutoCloseOnSuccess.value) {
    close();
  }
  return result;
};

const resetSession = () => {
  state.total = 0;
  state.success = 0;
  state.successIds = [];
  state.roundFailed = [];
  state.failedItems = [];
  state.isRetry = false;
  state.runner = null;
  sessionOptions.taskType = BatchTaskType.None;
  sessionOptions.batchSize = props.batchSize;
  sessionOptions.concurrent = props.concurrent;
  sessionOptions.autoCloseOnSuccess = props.autoCloseOnSuccess;
};

const close = () => {
  if (state.running) {
    return;
  }
  state.visible = false;
  emit('update:visible', false);
  resetSession();
  emit('closed');
};

const onVisibleChange = (value: boolean) => {
  if (!value) {
    close();
    return;
  }
  state.visible = true;
  emit('update:visible', true);
};

const applySessionOptions = (options?: BatchStartOptions) => {
  sessionOptions.taskType = options?.taskType ?? BatchTaskType.None;
  sessionOptions.batchSize = options?.batchSize ?? props.batchSize;
  sessionOptions.concurrent = options?.concurrent ?? props.concurrent;
  sessionOptions.autoCloseOnSuccess = options?.autoCloseOnSuccess ?? props.autoCloseOnSuccess;
};

/**
 * 开始一轮任务（打开弹窗；首次会重置累计成功数）
 */
const start = async (
  items: BatchProgressItem[],
  runner: BatchProgressRunner,
  options?: BatchStartOptions
): Promise<BatchFinishResult | null> => {
  if (state.running) {
    return null;
  }
  if (!items.length) {
    return null;
  }
  applySessionOptions(options);
  state.runner = runner;
  state.visible = true;
  emit('update:visible', true);
  state.isRetry = false;
  state.total = items.length;
  state.success = 0;
  state.successIds = [];
  state.roundFailed = [];
  state.failedItems = [];
  state.running = true;
  emitProgress();
  await runBatches(items);
  return finishRound();
};

/**
 * 仅对当前失败项再跑（内部方法，不弹确认）
 */
const retryFailed = async (): Promise<BatchFinishResult | null> => {
  if (state.running || !state.failedItems.length || !state.runner) {
    return null;
  }
  const queue = [...state.failedItems];
  state.isRetry = true;
  state.roundFailed = [];
  state.failedItems = [];
  state.running = true;
  emitProgress();
  await runBatches(queue);
  return finishRound();
};

/** 重试入口：先确认，取消则不执行 */
const handleRetryClick = async () => {
  if (state.running || !state.failedItems.length) {
    return;
  }
  try {
    await ElMessageBox.confirm(
      $t('common.batchProgress.retryConfirm', { count: state.failedItems.length }),
      $t('common.tip'),
      {
        type: 'warning',
        confirmButtonText: $t('common.confirm'),
        cancelButtonText: $t('common.cancel'),
        closeOnClickModal: false
      }
    );
  } catch {
    return;
  }
  await retryFailed();
};

defineExpose({
  start,
  retryFailed,
  close
});
</script>

<template>
  <ElDialog
    :model-value="state.visible"
    :title="$t('common.batchProgress.processList')"
    :width="width"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="!state.running"
    draggable
    append-to-body
    :show-close="!state.running"
    :align-center="false"
    modal-class="batch-progress-dialog-overlay"
    class="batch-progress-dialog"
    @update:model-value="onVisibleChange"
  >
    <div class="flex flex-col gap-12px">
      <div v-if="taskTypeLabel" class="text-14px font-medium">
        {{ taskTypeLabel }}
      </div>
      <div class="text-14px">
        {{ $t('common.batchProgress.successCount', { success: state.success, total: state.total }) }}
      </div>
      <ElProgress :percentage="percent" :status="progressStatus" />
      <div v-if="state.failedItems.length" class="flex flex-col gap-8px">
        <div class="text---el-color-danger text-(14px)">
          {{ $t('common.batchProgress.failedTitle') }}
        </div>
        <div class="max-h-160px overflow-y-auto text-13px leading-22px">
          <div v-for="item in state.failedItems" :key="item.id">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-12px">
        <ElButton v-if="!state.running && state.failedItems.length" type="primary" @click="handleRetryClick">
          {{ $t('common.batchProgress.retry') }}
        </ElButton>
        <ElButton v-if="!state.running" @click="close">
          {{ $t('common.close') }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss">
/* append-to-body：无遮罩右下角，且不拦截下层点击 */
.batch-progress-dialog-overlay {
  pointer-events: none !important;
  background: transparent !important;

  .el-dialog {
    pointer-events: auto;
  }
}

.batch-progress-dialog.el-dialog {
  position: fixed;
  right: 24px;
  bottom: 24px;
  margin: 0 !important;
  top: auto !important;
  left: auto !important;
}
</style>
