<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import HeaderBanner from './modules/header-banner.vue';
import ContentInfo from './modules/content-info.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <div class="home-container">
    <HeaderBanner class="mb-16px" />
    <ElRow :gutter="gap" class="flex-1">
      <ElCol :sm="24" class="h-full">
        <ContentInfo class="h-full" />
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
