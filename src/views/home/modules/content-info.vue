<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({ name: 'ContentInfo' });
</script>

<template>
  <ElCard class="h-full card-wrapper">
    <div class="h-full flex-center flex-col font-bold">
      <h1 class="mb-8px text-32px">{{ $t('page.home.contentInfo.welcome') }}</h1>
      <p class="text-20px">{{ $t('page.home.contentInfo.detail') }}</p>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.card-wrapper {
  :deep(.el-card__body) {
    height: 100%;
  }
}
</style>
