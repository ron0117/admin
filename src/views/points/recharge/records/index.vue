<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQSearch } from '@/components';
import { fetchAdminUserList, fetchRechargeOrders } from '@/service/api';
import { $t } from '@/locales';
import { getCurrentMonthDatetimeRange, parseSearchTimeRange } from '@/utils/time';

const [defaultFrom, defaultTo] = getCurrentMonthDatetimeRange();

defineOptions({ name: 'PointsRechargeRecords' });

const loading = ref(false);
const rows = ref<Api.Recharge.Order[]>([]);
const userOptions = ref<Array<{ label: string; value: string }>>([]);
const userLoading = ref(false);

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const query = reactive<{
  userId: string;
  status: '' | Api.Recharge.OrderStatus;
  from?: string;
  to?: string;
}>({
  userId: '',
  status: '',
  from: defaultFrom,
  to: defaultTo
});

const statusOptions = computed(() => [
  { label: $t('page.points.rechargeRecords.statusPending'), value: 'pending' },
  { label: $t('page.points.rechargeRecords.statusPaid'), value: 'paid' },
  { label: $t('page.points.rechargeRecords.statusFailed'), value: 'failed' },
  { label: $t('page.points.rechargeRecords.statusClosed'), value: 'closed' }
]);

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'userId',
    label: $t('page.points.rechargeRecords.user'),
    type: 'select',
    clearable: true,
    filterable: true,
    remote: true,
    remoteMethod: remoteSearchUsers,
    loading: userLoading.value,
    options: userOptions.value,
    placeholder: $t('page.points.rechargeRecords.userPlaceholder')
  },
  {
    prop: 'status',
    label: $t('page.points.rechargeRecords.status'),
    type: 'select',
    clearable: true,
    options: statusOptions.value
  },
  {
    prop: 'timeRange',
    label: $t('page.points.rechargeRecords.time'),
    type: 'datetimerange'
  }
]);

const columns = computed(() => [
  { prop: 'userEmail', label: $t('page.points.rechargeRecords.user'), minWidth: 160 },
  { prop: 'amountCents', label: $t('page.points.rechargeRecords.amount'), minWidth: 100, slot: 'amount' },
  { prop: 'feeCents', label: $t('page.points.rechargeRecords.fee'), minWidth: 90, slot: 'fee' },
  { prop: 'netCents', label: $t('page.points.rechargeRecords.net'), minWidth: 100, slot: 'net' },
  { prop: 'pointsCredited', label: $t('page.points.rechargeRecords.points'), minWidth: 100 },
  { prop: 'status', label: $t('page.points.rechargeRecords.status'), minWidth: 100, slot: 'status' },
  { prop: 'createdAt', label: $t('page.points.rechargeRecords.createdAt'), minWidth: 170, formatTime: true },
  { prop: 'paidAt', label: $t('page.points.rechargeRecords.paidAt'), minWidth: 170, formatTime: true },
  { prop: 'orderNo', label: $t('page.points.rechargeRecords.orderNo'), minWidth: 200, slot: 'orderNo' }
]);

function formatYuan(cents: number): string {
  return (cents / 100).toFixed(2);
}

function statusLabel(status: Api.Recharge.OrderStatus): string {
  const map: Record<Api.Recharge.OrderStatus, string> = {
    pending: $t('page.points.rechargeRecords.statusPending'),
    paid: $t('page.points.rechargeRecords.statusPaid'),
    failed: $t('page.points.rechargeRecords.statusFailed'),
    closed: $t('page.points.rechargeRecords.statusClosed')
  };
  return map[status];
}

async function remoteSearchUsers(keyword: string) {
  if (!keyword.trim()) {
    userOptions.value = [];
    return;
  }
  userLoading.value = true;
  const { data } = await fetchAdminUserList({ keyword: keyword.trim(), pageSize: 20 });
  userLoading.value = false;
  userOptions.value = (data?.items ?? []).map(u => ({
    value: u.id,
    label: u.username ? `${u.email} (${u.username})` : u.email
  }));
}

async function load() {
  loading.value = true;
  const { data, error } = await fetchRechargeOrders({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    userId: query.userId || undefined,
    status: query.status || undefined,
    from: query.from,
    to: query.to
  });
  loading.value = false;
  if (error || !data) return;
  rows.value = data.items;
  pagination.total = data.total;
}

function onSearch(form: Record<string, unknown>) {
  query.userId = (form.userId as string) || '';
  query.status = (form.status as typeof query.status) || '';
  const range = parseSearchTimeRange(form.timeRange);
  query.from = range.from;
  query.to = range.to;
  pagination.currentPage = 1;
  void load();
}
</script>

<template>
  <JQCustomPage>
    <JQSearch :form-items="searchItems" @search="onSearch" />
    <JQDataTable
      :columns="columns"
      :data="rows"
      :loading="loading"
      :pagination="pagination"
      :module-name="$t('page.points.rechargeRecords.title')"
      class="min-h-0 flex-1"
      row-key="id"
      @refresh="load"
      @pagination-change="
        ({ currentPage, pageSize }) => {
          pagination.currentPage = currentPage;
          pagination.pageSize = pageSize;
          load();
        }
      "
    >
      <template #amount="{ row }">{{ formatYuan(row.amountCents) }}</template>
      <template #fee="{ row }">{{ formatYuan(row.feeCents) }}</template>
      <template #net="{ row }">{{ formatYuan(row.netCents) }}</template>
      <template #status="{ row }">{{ statusLabel(row.status) }}</template>
      <template #orderNo="{ row }">
        <span class="mono">{{ row.orderNo }}</span>
      </template>
    </JQDataTable>
  </JQCustomPage>
</template>

<style scoped>
.mono {
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
