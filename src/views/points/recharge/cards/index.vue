<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import PhotoDurationCards from './PhotoDurationCards.vue';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm, JQSearch } from '@/components';
import {
  fetchAdminUserList,
  fetchGenerateRechargeCards,
  fetchRechargeCardShopConfig,
  fetchRechargeCards,
  patchRechargeCardShopConfig
} from '@/service/api';
import { getCurrentMonthDatetimeRange, parseSearchTimeRange } from '@/utils/time';
import { $t } from '@/locales';

const [defaultFrom, defaultTo] = getCurrentMonthDatetimeRange();

defineOptions({ name: 'PointsRechargeCards' });

const activeTab = ref('points');
const loading = ref(false);
const rows = ref<Api.Recharge.Card[]>([]);
const selectedRows = ref<Api.Recharge.Card[]>([]);
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
  selectedRows.value = [];
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
  loadList();
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

function onSelectionChange(selection: Api.Recharge.Card[]) {
  selectedRows.value = selection;
}

function onExport() {
  const selectedIds = new Set(selectedRows.value.map(row => row.id));
  const codes = rows.value.filter(row => selectedIds.has(row.id)).map(row => row.code);
  if (!codes.length) {
    ElMessage.warning($t('page.points.rechargeCards.exportSelectHint'));
    return;
  }
  const url = URL.createObjectURL(new Blob([codes.join('\r\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'recharge-cards.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    <ElTabs v-model="activeTab" type="border-card" class="recharge-card-tabs">
      <ElTabPane label="积分卡" name="points" class="recharge-card-pane recharge-card-pane--fill">
        <JQSearch :form-items="searchItems" @search="onSearch" />
        <JQDataTable
          :columns="columns"
          :data="rows"
          :loading="loading"
          :pagination="pagination"
          :module-name="$t('page.points.rechargeCards.title')"
          class="min-h-0 flex-1"
          row-key="id"
          show-selection
          @selection-change="onSelectionChange"
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
            <ElButton type="primary" @click="formVisible = true">
              {{ $t('page.points.rechargeCards.generate') }}
            </ElButton>
            <ElButton @click="openShopConfig">
              {{ $t('page.points.rechargeCards.shopConfig') }}
            </ElButton>
            <ElButton
              :disabled="!selectedRows.length"
              :title="$t('page.points.rechargeCards.exportSelectHint')"
              @click="onExport"
            >
              {{
                selectedRows.length
                  ? $t('page.points.rechargeCards.exportSelected', { count: selectedRows.length })
                  : $t('page.points.rechargeCards.export')
              }}
            </ElButton>
          </template>
          <template #code="{ row }">
            <span class="code-cell">{{ row.code }}</span>
            <ElButton link type="primary" size="small" @click="copyCode(row.code)">
              {{ $t('page.points.rechargeCards.copy') }}
            </ElButton>
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

        <ElDialog
          v-model="shopConfigVisible"
          :title="$t('page.points.rechargeCards.shopConfigTitle')"
          width="520px"
          :close-on-click-modal="false"
        >
          <ElForm v-loading="shopConfigLoading" label-width="96px" @submit.prevent="saveShopConfig">
            <ElFormItem :label="$t('page.points.rechargeCards.shopUrl')">
              <ElInput
                v-model="shopUrlInput"
                :placeholder="$t('page.points.rechargeCards.shopUrlPlaceholder')"
                maxlength="2048"
                clearable
              />
            </ElFormItem>
          </ElForm>
          <template #footer>
            <ElButton @click="shopConfigVisible = false">{{ $t('common.cancel') }}</ElButton>
            <ElButton type="primary" :loading="shopConfigSaving" @click="saveShopConfig">
              {{ $t('common.confirm') }}
            </ElButton>
          </template>
        </ElDialog>
      </ElTabPane>
      <ElTabPane label="洗图时长卡" name="photo" class="recharge-card-pane recharge-card-pane--fill" lazy>
        <PhotoDurationCards />
      </ElTabPane>
    </ElTabs>
  </JQCustomPage>
</template>

<style scoped>
.recharge-card-tabs {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.recharge-card-tabs :deep(.el-tabs__header) {
  flex-shrink: 0;
  margin: 0;
}

.recharge-card-tabs :deep(.el-tabs__content) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 16px;
  overflow: hidden;
}

.recharge-card-tabs :deep(.el-tab-pane) {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: auto;
}

.recharge-card-tabs :deep(.recharge-card-pane--fill) {
  overflow: hidden;
}

.code-cell {
  font-family: ui-monospace, monospace;
  margin-right: 8px;
}

.muted {
  color: var(--el-text-color-secondary);
}
</style>
