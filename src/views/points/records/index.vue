<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQSearch } from '@/components';
import { fetchPointLedgers } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'PointsRecords' });

const LIVE_MENU = 'generate.create.live';

const MENU_CODES: Array<{ code: string; nameKey: string }> = [
  { code: 'generate.create.inspire', nameKey: 'page.points.menu.inspire' },
  { code: 'generate.create.fission', nameKey: 'page.points.menu.fission' },
  { code: 'generate.create.scene-renew', nameKey: 'page.points.menu.sceneRenew' },
  { code: 'generate.create.free', nameKey: 'page.points.menu.free' },
  { code: 'generate.create.live', nameKey: 'page.points.menu.live' },
  { code: 'generate.create.copywrite', nameKey: 'page.points.menu.copywrite' }
];

const loading = ref(false);
const rows = ref<Api.Points.Ledger[]>([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const query = reactive<{
  keyword: string;
  type: '' | Api.Points.LedgerType;
  menuCode: string;
  status: '' | Api.Points.LedgerStatus;
  from?: string;
  to?: string;
}>({
  keyword: '',
  type: '',
  menuCode: '',
  status: ''
});

const typeOptions = computed(() => [
  { label: $t('page.points.records.typeConsume'), value: 'consume' },
  { label: $t('page.points.records.typeRefund'), value: 'refund' },
  { label: $t('page.points.records.typeIncrease'), value: 'admin_increase' },
  { label: $t('page.points.records.typeDecrease'), value: 'admin_decrease' }
]);

const statusOptions = computed(() => [
  { label: $t('page.points.records.statusPending'), value: 'pending' },
  { label: $t('page.points.records.statusCompleted'), value: 'completed' },
  { label: $t('page.points.records.statusRefunded'), value: 'refunded' }
]);

const menuOptions = computed(() =>
  MENU_CODES.map(item => ({ label: $t(item.nameKey as App.I18n.I18nKey), value: item.code }))
);

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'keyword',
    label: $t('page.points.records.user'),
    type: 'input',
    placeholder: $t('page.points.records.userPlaceholder')
  },
  {
    prop: 'type',
    label: $t('page.points.records.type'),
    type: 'select',
    clearable: true,
    options: typeOptions.value
  },
  {
    prop: 'menuCode',
    label: $t('page.points.records.feature'),
    type: 'select',
    clearable: true,
    options: menuOptions.value
  },
  {
    prop: 'status',
    label: $t('page.points.records.status'),
    type: 'select',
    clearable: true,
    options: statusOptions.value
  },
  {
    prop: 'timeRange',
    label: $t('page.points.records.time'),
    type: 'datetimerange'
  }
]);

const columns = computed(() => [
  { prop: 'createdAt', label: $t('page.points.records.time'), minWidth: 170, formatTime: true },
  { prop: 'user', label: $t('page.points.records.user'), minWidth: 200, slot: 'user' },
  { prop: 'type', label: $t('page.points.records.type'), minWidth: 110, slot: 'type' },
  { prop: 'feature', label: $t('page.points.records.featureSpec'), minWidth: 160, slot: 'feature' },
  { prop: 'quantity', label: $t('page.points.records.quantity'), minWidth: 80, slot: 'quantity' },
  { prop: 'amount', label: $t('page.points.records.delta'), minWidth: 100, slot: 'amount' },
  { prop: 'balanceAfter', label: $t('page.points.records.balanceAfter'), minWidth: 110 },
  { prop: 'requestId', label: $t('page.points.records.requestId'), minWidth: 180, slot: 'requestId' },
  { prop: 'status', label: $t('page.points.records.status'), minWidth: 100, slot: 'status' },
  { prop: 'remark', label: $t('page.points.records.remark'), minWidth: 140, slot: 'remark' },
  { prop: 'actions', label: $t('common.operate'), minWidth: 110, slot: 'actions', fixed: 'right' }
]);

const ledgerRow = (row: unknown) => row as Api.Points.Ledger;

const typeLabel = (type: Api.Points.LedgerType) => {
  if (type === 'consume') return $t('page.points.records.typeConsume');
  if (type === 'refund') return $t('page.points.records.typeRefund');
  if (type === 'admin_increase') return $t('page.points.records.typeIncrease');
  return $t('page.points.records.typeDecrease');
};

const typeTag = (type: Api.Points.LedgerType) => {
  if (type === 'consume') return 'danger';
  if (type === 'refund' || type === 'admin_increase') return 'success';
  return 'warning';
};

const statusLabel = (status: Api.Points.LedgerStatus) => {
  if (status === 'pending') return $t('page.points.records.statusPending');
  if (status === 'completed') return $t('page.points.records.statusCompleted');
  return $t('page.points.records.statusRefunded');
};

const menuName = (menuCode: string | null) => {
  if (!menuCode) return '—';
  const found = MENU_CODES.find(item => item.code === menuCode);
  return found ? $t(found.nameKey as App.I18n.I18nKey) : menuCode;
};

const specLabel = (row: Api.Points.Ledger) => {
  if (!row.specKey) return '';
  if (row.menuCode === LIVE_MENU) {
    if (row.specKey === 'high') return $t('page.points.settings.unitHigh');
    if (row.specKey === 'medium') return $t('page.points.settings.unitMedium');
    if (row.specKey === 'good') return $t('page.points.settings.unitGood');
  }
  return $t('page.points.settings.unitPoints');
};

const featureText = (row: Api.Points.Ledger) => {
  if (!row.menuCode) return '—';
  const spec = specLabel(row);
  return spec ? `${menuName(row.menuCode)} / ${spec}` : menuName(row.menuCode);
};

const signedAmount = (row: Api.Points.Ledger) => {
  const n = row.amount;
  if (row.type === 'consume' || row.type === 'admin_decrease') {
    return `-${n}`;
  }
  return `+${n}`;
};

const amountClass = (row: Api.Points.Ledger) =>
  row.type === 'consume' || row.type === 'admin_decrease' ? 'text-red-500' : 'text-green-600';

const userText = (row: Api.Points.Ledger) => (row.username ? `${row.email}（${row.username}）` : row.email);

const loadList = async () => {
  loading.value = true;
  const { data, error } = await fetchPointLedgers({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    keyword: query.keyword || undefined,
    type: query.type || undefined,
    menuCode: query.menuCode || undefined,
    status: query.status || undefined,
    from: query.from,
    to: query.to
  });
  loading.value = false;
  if (error || !data) {
    return;
  }
  rows.value = data.items;
  pagination.total = data.total;
};

const parseRange = (value: unknown): { from?: string; to?: string } => {
  if (!Array.isArray(value) || value.length < 2) {
    return {};
  }
  const from = value[0] ? String(value[0]) : undefined;
  const to = value[1] ? String(value[1]) : undefined;
  return { from, to };
};

const handleSearch = (data: Record<string, unknown>) => {
  query.keyword = String(data.keyword || '');
  query.type = (data.type as Api.Points.LedgerType) || '';
  query.menuCode = String(data.menuCode || '');
  query.status = (data.status as Api.Points.LedgerStatus) || '';
  const range = parseRange(data.timeRange);
  query.from = range.from;
  query.to = range.to;
  pagination.currentPage = 1;
  loadList();
};

const handleReset = () => {
  query.keyword = '';
  query.type = '';
  query.menuCode = '';
  query.status = '';
  query.from = undefined;
  query.to = undefined;
  pagination.currentPage = 1;
  loadList();
};

const copyRequestId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id);
    window.$message?.success($t('page.points.records.copySuccess'));
  } catch {
    window.$message?.error($t('page.points.records.copyFailed'));
  }
};

onMounted(() => {
  loadList();
});
</script>

<template>
  <JQCustomPage>
    <JQSearch :form-items="searchItems" @search="handleSearch" @reset="handleReset" />
    <JQDataTable
      :data="rows"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :module-name="$t('page.points.records.title')"
      class="min-h-0 flex-1"
      row-key="id"
      @refresh="loadList"
      @pagination-change="
        ({ currentPage, pageSize }) => {
          pagination.currentPage = currentPage;
          pagination.pageSize = pageSize;
          loadList();
        }
      "
    >
      <template #user="{ row }">
        {{ userText(ledgerRow(row)) }}
      </template>
      <template #type="{ row }">
        <ElTag :type="typeTag(ledgerRow(row).type)" size="small">
          {{ typeLabel(ledgerRow(row).type) }}
        </ElTag>
      </template>
      <template #feature="{ row }">
        {{ featureText(ledgerRow(row)) }}
      </template>
      <template #quantity="{ row }">
        {{ ledgerRow(row).quantity ?? '—' }}
      </template>
      <template #amount="{ row }">
        <span :class="amountClass(ledgerRow(row))">{{ signedAmount(ledgerRow(row)) }}</span>
      </template>
      <template #requestId="{ row }">
        <span class="text-12px font-mono">{{ ledgerRow(row).requestId || '—' }}</span>
      </template>
      <template #status="{ row }">
        {{ statusLabel(ledgerRow(row).status) }}
      </template>
      <template #remark="{ row }">
        {{ ledgerRow(row).remark || '—' }}
      </template>
      <template #actions="{ row }">
        <ElButton
          v-if="ledgerRow(row).requestId"
          type="primary"
          plain
          size="small"
          @click="copyRequestId(ledgerRow(row).requestId!)"
        >
          {{ $t('page.points.records.copyId') }}
        </ElButton>
        <span v-else>—</span>
      </template>
    </JQDataTable>
  </JQCustomPage>
</template>
