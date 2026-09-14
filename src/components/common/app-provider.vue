<script setup lang="ts">
import { createTextVNode, defineComponent, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { useBatchStore } from '@/store/modules/batch';
import type { GameTemplatePublishPayload } from '@/store/modules/batch';
import JQBatchProgressDialog from '@/components/custom/batch-progress-dialog.vue';
import type { BatchTaskType } from '@/enum/batch';

defineOptions({ name: 'AppProvider' });

const batchDialogRef = ref<InstanceType<typeof JQBatchProgressDialog>>();
const batchStore = useBatchStore();

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    const register = () => {
      window.$notification = ElNotification;
      window.$messageBox = ElMessageBox;
      window.$message = ElMessage;
    };

    register();

    return () => createTextVNode();
  }
});

onMounted(() => {
  batchStore.registerExecutor({
    start: (items, runner, options) => batchDialogRef.value!.start(items, runner, options)
  });

  window.$batch = {
    isRunning: (type?: BatchTaskType) => batchStore.isRunning(type),
    getActiveTask: () => batchStore.activeTask,
    startGameTemplatePublish: (payload: GameTemplatePublishPayload) => batchStore.startGameTemplatePublish(payload),
    resetTask: () => batchStore.resetTask()
  };
});

const handleBatchClosed = () => {
  batchStore.resetTask();
};
</script>

<template>
  <div class="h-full">
    <ContextHolder />
    <slot></slot>
    <JQBatchProgressDialog ref="batchDialogRef" @closed="handleBatchClosed" />
  </div>
</template>

<style scoped></style>
