<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm, JQSearch } from '@/components';
import {
  downloadRechargeCardsExport,
  fetchAdminUserList,
  fetchGenerateRechargeCards,
  fetchRechargeCardShopConfig,
  fetchRechargeCards,
  patchRechargeCardShopConfig
} from '@/service/api';
import { $t } from '@/locales';
import { getCurrentMonthDatetimeRange, parseSearchTimeRange } from '@/utils/time';

const [defaultFrom, defaultTo] = getCurrentMonthDatetimeRange();

defineOptions({ name: 'PointsRechargeCards' });

const loading = ref(false);
const exporting = ref(false);
const rows = ref<Api.Recharge.Card[]>([]);
const formVisible = ref(false);
const shopConfigVisible = ref(false);
const shopUrlInput = ref('');
const shopConfigLoading = ref(false);
const shopConfigSaving = ref(false);
const userOptions = ref<Array<{ label: string; value: string }>>([]);
const userLoading = ref(false);

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const query = reactive<{
  status: '' | Api.Recharge.CardStatus;
  codeKeyword: string;
  redeemedUserId: string;
  from?: string;
  to?: string;
}>({
  status: '',
  codeKeyword: '',
  redeemedUserId: '',
  from: defaultFrom,
  to: defaultTo
});

const statusOptions = computed(() => [
  { label: $t('page.points.rechargeCards.statusUnused'), value: 'unused' },
  { label: $t('page.points.rechargeCards.statusRedeemed'), value: 'redeemed' }
]);

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'status',
    label: $t('page.points.rechargeCards.status'),
    type: 'select',
    clearable: true,
    options: statusOptions.value
  },
  {
    prop: 'codeKeyword',
    label: $t('page.points.rechargeCards.code'),
    type: 'input',
    placeholder: $t('page.points.rechargeCards.codeKeywordPlaceholder')
  },
  {
    prop: 'redeemedUserId',
    label: $t('page.points.rechargeCards.redeemedUser'),
    type: 'select',
    clearable: true,
    filterable: true,
    remote: true,
    remoteMethod: remoteSearchUsers,
    loading: userLoading.value,
    options: userOptions.value,
    placeholder: $t('page.points.rechargeCards.redeemedUserPlaceholder')
  },
  {
    prop: 'timeRange',
    label: $t('page.points.rechargeCards.createdAt'),
    type: 'datetimerange'
  }
]);

const columns = computed(() => [
  { prop: 'code', label: $t('page.points.rechargeCards.code'), minWidth: 220, slot: 'code' },
  { prop: 'points', label: $t('page.points.rechargeCards.points'), minWidth: 90 },
  { prop: 'status', label: $t('page.points.rechargeCards.status'), minWidth: 100, slot: 'status' },
  { prop: 'batchNote', label: $t('page.points.rechargeCards.batchNote'), minWidth: 120, slot: 'batchNote' },
  { prop: 'createdAt', label: $t('page.points.rechargeCards.createdAt'), minWidth: 170, formatTime: true },
  { prop: 'redeemedAt', label: $t('page.points.rechargeCards.redeemedAt'), minWidth: 170, slot: 'redeemedAt' },
  {
    prop: 'redeemedUserEmail',
    label: $t('page.points.rechargeCards.redeemedUser'),
    minWidth: 160,
    slot: 'redeemedUser'
  }
]);

const formItems = computed<FormItem[]>(() => [
  {
    prop: 'count',
    label: $t('page.points.rechargeCards.generateCount'),
    type: 'number',
    span: 2,
    componentProps: { min: 1, max: 500, step: 1, precision: 0, controls: true },
    rules: [{ required: true, type: 'number', min: 1, max: 500, trigger: 'blur' }]
  },
  {
    prop: 'points',
    label: $t('page.points.rechargeCards.generatePoints'),
    type: 'number',
    span: 2,
    componentProps: { min: 1, step: 1, precision: 0, controls: true },
    rules: [{ required: true, type: 'number', min: 1, trigger: 'blur' }]
  },
  {
    prop: 'batchNote',
    label: $t('page.points.rechargeCards.batchNote'),
    type: 'input',
    span: 2,
    componentProps: { maxlength: 200, showWordLimit: true }
  }
]);

async function remoteSearchUsers(keyword: string) {
  if (!keyword.trim()) {
    userOptions.value = [];
    return;
  }
  userLoading.value = true;
  const { data } = await fetchAdminUserList({ keyword: keyword.trim(), pageSize: 20 });
  userLoading.value = false;
  userOptions.value = (data?.items ?? []).map(u => ({
    label: u.username ? `${u.email} (${u.username})` : u.email,
    value: u.id
  }));
}

function buildListParams(): Api.Recharge.CardListQuery {
  return {
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    status: query.status || undefined,
    codeKeyword: query.codeKeyword.trim() || undefined,
    redeemedUserId: query.redeemedUserId || undefined,
    createdFrom: query.from,
    createdTo: query.to
  };
}

async function loadList() {
  loading.value = true;
  const { data, error } = await fetchRechargeCards(buildListParams());
  loading.value = false;
  if (error || !data) return;
  rows.value = data.items;
  pagination.total = data.total;
}

function onSearch(form: Record<string, unknown>) {
  query.status = (form.status as typeof query.status) ?? '';
  query.codeKeyword = String(form.codeKeyword ?? '');
  query.redeemedUserId = String(form.redeemedUserId ?? '');
  const range = parseSearchTimeRange(form.timeRange);
  query.from = range.from;
  query.to = range.to;
  pagination.currentPage = 1;
  void loadList();
}

async function onGenerateSubmit(form: Record<string, unknown>) {
  const { error } = await fetchGenerateRechargeCards({
    count: Number(form.count),
    points: Number(form.points),
    batchNote: form.batchNote ? String(form.batchNote) : undefined
  });
  if (error) return;
  window.$message?.success($t('page.points.rechargeCards.generateSuccess'));
  formVisible.value = false;
  pagination.currentPage = 1;
  await loadList();
}

async function onExport() {
  exporting.value = true;
  try {
    await downloadRechargeCardsExport(buildListParams());
  } catch {
    ElMessage.error($t('page.points.rechargeCards.exportFailed'));
  } finally {
    exporting.value = false;
  }
}

function statusLabel(status: Api.Recharge.CardStatus) {
  return status === 'redeemed'
    ? $t('page.points.rechargeCards.statusRedeemed')
    : $t('page.points.rechargeCards.statusUnused');
}

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    window.$message?.success($t('page.points.rechargeCards.copySuccess'));
  } catch {
    ElMessage.error($t('page.points.rechargeCards.copyFailed'));
  }
}

async function openShopConfig() {
  shopConfigVisible.value = true;
  shopConfigLoading.value = true;
  shopUrlInput.value = '';
  const { data, error } = await fetchRechargeCardShopConfig();
  shopConfigLoading.value = false;
  if (error || !data) return;
  shopUrlInput.value = data.shopUrl ?? '';
}

async function saveShopConfig() {
  shopConfigSaving.value = true;
  const { error } = await patchRechargeCardShopConfig({ shopUrl: shopUrlInput.value });
  shopConfigSaving.value = false;
  if (error) {
    ElMessage.error($t('page.points.rechargeCards.shopConfigSaveFailed'));
    return;
  }
  window.$message?.success($t('page.points.rechargeCards.shopConfigSaveSuccess'));
  shopConfigVisible.value = false;
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
      :module-name="$t('page.points.rechargeCards.title')"
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
      <template #header-prefix>
        <el-button type="primary" @click="formVisible = true">
          {{ $t('page.points.rechargeCards.generate') }}
        </el-button>
        <el-button @click="openShopConfig">
          {{ $t('page.points.rechargeCards.shopConfig') }}
        </el-button>
        <el-button :loading="exporting" @click="onExport">
          {{ $t('page.points.rechargeCards.export') }}
        </el-button>
      </template>
      <template #code="{ row }">
        <span class="code-cell">{{ row.code }}</span>
        <el-button link type="primary" size="small" @click="copyCode(row.code)">
          {{ $t('page.points.rechargeCards.copy') }}
        </el-button>
      </template>
      <template #status="{ row }">
        {{ statusLabel(row.status) }}
      </template>
      <template #batchNote="{ row }">
        {{ row.batchNote || '—' }}
      </template>
      <template #redeemedAt="{ row }">
        {{ row.redeemedAt ? new Date(row.redeemedAt).toLocaleString() : '—' }}
      </template>
      <template #redeemedUser="{ row }">
        <span v-if="row.redeemedUserEmail">
          {{ row.redeemedUserEmail }}
          <span v-if="row.redeemedUserUsername" class="muted">({{ row.redeemedUserUsername }})</span>
        </span>
        <span v-else>—</span>
      </template>
    </JQDataTable>

    <JQDialogForm
      v-model="formVisible"
      :title="$t('page.points.rechargeCards.generateTitle')"
      :form-items="formItems"
      width="520px"
      :close-on-click-modal="false"
      :on-submit="onGenerateSubmit"
    />

    <el-dialog
      v-model="shopConfigVisible"
      :title="$t('page.points.rechargeCards.shopConfigTitle')"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form v-loading="shopConfigLoading" label-width="96px" @submit.prevent="saveShopConfig">
        <el-form-item :label="$t('page.points.rechargeCards.shopUrl')">
          <el-input
            v-model="shopUrlInput"
            :placeholder="$t('page.points.rechargeCards.shopUrlPlaceholder')"
            maxlength="2048"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shopConfigVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="shopConfigSaving" @click="saveShopConfig">
          {{ $t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </JQCustomPage>
</template>

<style scoped>
.code-cell {
  font-family: ui-monospace, monospace;
  margin-right: 8px;
}

.muted {
  color: var(--el-text-color-secondary);
}
</style>
