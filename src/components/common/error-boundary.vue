<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import { useRouter } from 'vue-router';

// 定义 Props
// interface Props {
//   stopPropagation?: boolean;
// }

// withDefaults(defineProps<Props>(), {
//   stopPropagation: true
// });

const error = ref<Error | null>(null);
const router = useRouter();
const isDev = import.meta.env.DEV;

onErrorCaptured((err: Error) => {
  console.error('ErrorBoundary Caught:', err);
  error.value = err;

  // 返回 false 阻止错误继续向上传递
  return false;
});

const resetError = () => {
  error.value = null;
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="h-full w-full flex-col-center">
    <!-- 正常渲染插槽内容 -->
    <slot v-if="!error" />

    <!-- 发生错误时显示的 UI -->
    <div v-else class="flex-col-start w-600px gap-16px rounded-8px bg-white p-24px shadow-sm dark:bg-dark-3">
      <!-- 头部图标与标题 -->
      <div class="flex-y-center gap-12px text-error">
        <icon-mdi-alert-circle class="text-48px" />
        <h3 class="text-20px font-bold">发生了一些错误</h3>
      </div>

      <!-- 错误信息 -->
      <div class="w-full">
        <p class="line-clamp-3 text-14px text-gray-800 dark:text-gray-200">
          {{ error.message || '未知错误' }}
        </p>

        <!-- 仅在开发环境显示堆栈 -->
        <div v-if="isDev" class="mt-12px">
          <ElCollapse>
            <ElCollapseItem title="查看错误堆栈" name="1">
              <pre
                class="max-h-300px overflow-auto rounded-4px bg-gray-100 p-12px text-12px text-gray-600 dark:bg-dark-4 dark:text-gray-400"
                >{{ error.stack }}</pre
              >
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="flex-y-center justify-end gap-12px">
        <NButton type="primary" @click="resetError">
          <template #icon>
            <icon-mdi-refresh />
          </template>
          重试
        </NButton>
        <NButton @click="goHome">
          <template #icon>
            <icon-mdi-home />
          </template>
          返回首页
        </NButton>
      </div>
    </div>
  </div>
</template>
