<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQSearch } from '@/components';
import { fetchPointStats, fetchPointStatsUsers } from '@/service/api';
import { parseSearchTimeRange } from '@/utils/time';
import { $t } from '@/locales';

defineOptions({ name: 'PointsStats' });

const activeTab = ref('user');
const loading = ref(false);
const stats = ref<Api.Points.StatsResp | null>(null);
const users = ref<Api.Points.StatsUser[]>([]);
const rangeQuery = ref<Api.Points.StatsQuery>({});
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'timeRange',
    label: $t('page.points.records.time'),
    type: 'datetimerange'
  }
]);

const featureRows = computed(() => {
  const list = stats.value?.byFeature ?? [];
  const total = stats.value?.total ?? 0;
  if (total === 0 || list.length === 0) {
    return list.map(row => ({ ...row, share: '0%' }));
  }
  const tenths = list.map(row => Math.round((row.netPoints / total) * 1000));
  let used = 0;
  return list.map((row, index) => {
    const value = index === list.length - 1 ? 1000 - used : tenths[index];
    if (index < list.length - 1) used += tenths[index];
    return { ...row, share: `${(value / 10).toFixed(1)}%` };
  });
});

const userColumns = computed(() => [
  { prop: 'displayName', label: $t('page.points.records.user'), minWidth: 140 },
  { prop: 'email', label: $t('page.points.stats.email'), minWidth: 200 },
  { prop: 'roles', label: $t('page.points.stats.roles'), minWidth: 160, slot: 'roles' },
  { prop: 'netPoints', label: $t('page.points.stats.netPoints'), minWidth: 100 },
  { prop: 'consumeCount', label: $t('page.points.stats.consumeCount'), minWidth: 80 }
]);

const roleColumns = computed(() => [
  { prop: 'name', label: $t('page.points.records.role'), minWidth: 140 },
  { prop: 'status', label: $t('common.status'), minWidth: 100, slot: 'status' },
  { prop: 'netPoints', label: $t('page.points.stats.netPoints'), minWidth: 100 },
  { prop: 'userCount', label: $t('page.points.stats.userCount'), minWidth: 120 }
]);

const featureColumns = computed(() => [
  { prop: 'name', label: $t('page.points.stats.feature'), minWidth: 160 },
  { prop: 'netPoints', label: $t('page.points.stats.netPoints'), minWidth: 100 },
  { prop: 'consumeCount', label: $t('page.points.stats.consumeCount'), minWidth: 80 },
  { prop: 'share', label: $t('page.points.stats.share'), minWidth: 140 }
]);

function roleStatus(row: Api.Points.StatsRole) {
  if (row.unassigned || !row.status) return $t('page.points.stats.dash');
  if (row.status === 'disabled') return $t('page.points.stats.statusDisabled');
  return $t('page.points.stats.statusActive');
}

function rolesText(row: Api.Points.StatsUser) {
  return row.roles.length > 0 ? row.roles.join('、') : $t('page.points.stats.unassigned');
}

async function loadStats() {
  const { data, error } = await fetchPointStats(rangeQuery.value);
  if (error || !data) return;
  stats.value = data;
}

async function loadUsers() {
  loading.value = true;
  const { data, error } = await fetchPointStatsUsers({
    ...rangeQuery.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize
  });
  loading.value = false;
  if (error || !data) return;
  users.value = data.items;
  pagination.total = data.total;
}

function handleSearch(data: Record<string, unknown>) {
  const range = parseSearchTimeRange(data.timeRange);
  rangeQuery.value = { from: range.from, to: range.to };
  pagination.currentPage = 1;
  loadStats();
  loadUsers();
}
</script>

<template>
  <JQCustomPage>
    <JQSearch :form-items="searchItems" @search="handleSearch" />
    <ElTabs v-model="activeTab" type="border-card" class="stats-tabs">
      <ElTabPane :label="$t('page.points.stats.byUser')" name="user" class="stats-pane">
        <JQDataTable
          class="min-h-0 flex-1"
          :data="users"
          :columns="userColumns"
          :loading="loading"
          :pagination="pagination"
          row-key="userId"
          @refresh="loadUsers"
          @pagination-change="
            ({ currentPage, pageSize }) => {
              pagination.currentPage = currentPage;
              pagination.pageSize = pageSize;
              loadUsers();
            }
          "
        >
          <template #roles="{ row }">
            {{ rolesText(row as Api.Points.StatsUser) }}
          </template>
        </JQDataTable>
      </ElTabPane>
      <ElTabPane :label="$t('page.points.stats.byRole')" name="role" class="stats-pane">
        <JQDataTable
          class="min-h-0 flex-1"
          :data="stats?.byRole ?? []"
          :columns="roleColumns"
          :show-pagination="false"
          row-key="name"
          @refresh="loadStats"
        >
          <template #status="{ row }">
            {{ roleStatus(row as Api.Points.StatsRole) }}
          </template>
        </JQDataTable>
      </ElTabPane>
      <ElTabPane :label="$t('page.points.stats.byFeature')" name="feature" class="stats-pane">
        <JQDataTable
          class="min-h-0 flex-1"
          :data="featureRows"
          :columns="featureColumns"
          :show-pagination="false"
          row-key="name"
          @refresh="loadStats"
        />
      </ElTabPane>
    </ElTabs>
  </JQCustomPage>
</template>

<style scoped>
.stats-tabs {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.stats-tabs :deep(.el-tabs__header) {
  flex-shrink: 0;
  margin: 0;
}

.stats-tabs :deep(.el-tabs__content) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.stats-tabs :deep(.el-tab-pane) {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}
</style>
