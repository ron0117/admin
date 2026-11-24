<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchPointStats } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { getShanghaiRecentDaysRange } from '@/utils/time';
import { $t } from '@/locales';
import FeatureConsumePie from '../points/stats/modules/FeatureConsumePie.vue';
import RoleConsumeBar from '../points/stats/modules/RoleConsumeBar.vue';
import UserConsumeBar from '../points/stats/modules/UserConsumeBar.vue';
import HeaderBanner from './modules/header-banner.vue';

const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));

const loading = ref(true);
const failed = ref(false);
const stats = ref<Api.Points.StatsResp | null>(null);
const showCharts = computed(() => !failed.value && (stats.value?.total ?? 0) > 0);
const showEmpty = computed(() => !failed.value && stats.value !== null && stats.value.total === 0);

onMounted(async () => {
  const [from, to] = getShanghaiRecentDaysRange(30);
  loading.value = true;
  const { data, error } = await fetchPointStats({ from, to });
  loading.value = false;
  if (error || !data) {
    failed.value = true;
    return;
  }
  stats.value = data;
});
</script>

<template>
  <div v-loading="loading" class="home-container">
    <HeaderBanner class="mb-16px" />
    <ElRow :gutter="gap">
      <ElCol :xs="24" :lg="14" class="mb-16px">
        <ElCard class="card-wrapper h-full">
          <template #header>
            <div class="font-semibold">{{ $t('page.points.stats.byUser') }}</div>
            <p class="mt-4px text-12px text-gray-500 font-normal">{{ $t('page.points.stats.last30Hint') }}</p>
          </template>
          <div v-if="failed" class="h-320px flex-center text-gray-500">{{ $t('page.points.stats.loadFailed') }}</div>
          <div v-else-if="showEmpty" class="h-320px flex-center text-gray-500">{{ $t('page.points.stats.empty') }}</div>
          <UserConsumeBar v-else-if="showCharts" :users="stats?.byUser ?? []" />
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :lg="10" class="mb-16px">
        <ElCard class="card-wrapper h-full">
          <template #header>
            <div class="font-semibold">{{ $t('page.points.stats.byRole') }}</div>
            <p class="mt-4px text-12px text-gray-500 font-normal">{{ $t('page.points.stats.last30Hint') }}</p>
            <p class="mt-4px text-12px text-gray-500 font-normal">{{ $t('page.points.stats.roleHint') }}</p>
          </template>
          <div v-if="failed" class="h-320px flex-center text-gray-500">{{ $t('page.points.stats.loadFailed') }}</div>
          <div v-else-if="showEmpty" class="h-320px flex-center text-gray-500">{{ $t('page.points.stats.empty') }}</div>
          <RoleConsumeBar v-else-if="showCharts" :roles="stats?.byRole ?? []" />
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :lg="12" class="mb-16px">
        <ElCard class="card-wrapper">
          <template #header>
            <div class="font-semibold">{{ $t('page.points.stats.byFeature') }}</div>
            <p class="mt-4px text-12px text-gray-500 font-normal">{{ $t('page.points.stats.last30Hint') }}</p>
          </template>
          <div v-if="failed" class="h-320px flex-center text-gray-500">{{ $t('page.points.stats.loadFailed') }}</div>
          <div v-else-if="showEmpty" class="h-320px flex-center text-gray-500">{{ $t('page.points.stats.empty') }}</div>
          <FeatureConsumePie v-else-if="showCharts" :features="stats?.byFeature ?? []" :total="stats?.total ?? 0" />
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  height: 100%;
  overflow: auto;
}
</style>
