<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormItem } from '@/components';
import { JQDataTable, JQDialogForm, JQSearch } from '@/components';
import { nestRequest } from '@/service/request/nest';
import { $t } from '@/locales';

interface Member {
  expiresAt: string;
  suspended: boolean;
  leaseUntil: string | null;
  deviceId: string | null;
}

interface Card {
  code: string;
  days: number;
  priceCents: number | null;
  redeemedBy: string | null;
  redeemedAt: string | null;
  voidedAt: string | null;
  holder: { email: string; photoMembership: Member | null } | null;
}

const searchItems: FormItem[] = [
  {
    prop: 'keyword',
    label: '查询',
    type: 'input',
    clearable: true,
    placeholder: '卡号或兑换账号邮箱'
  }
];

const generateInitial = {
  count: 1,
  days: 30,
  price: 99
};

const generateItems: FormItem[] = [
  {
    prop: 'days',
    label: '有效天数',
    type: 'slot',
    slotName: 'days',
    span: 2,
    rules: [{ required: true, type: 'number', min: 1, max: 36500, trigger: 'blur' }]
  },
  {
    prop: 'price',
    label: '售价（元）',
    type: 'number',
    span: 2,
    componentProps: { min: 0, step: 1, precision: 2, controls: true }
  },
  {
    prop: 'count',
    label: '张数',
    type: 'number',
    span: 2,
    componentProps: { min: 1, max: 500, step: 1, precision: 0, controls: true },
    rules: [{ required: true, type: 'number', min: 1, max: 500, trigger: 'blur' }]
  }
];

const columns = [
  { prop: 'code', label: '卡密', minWidth: 240, slot: 'code' },
  { prop: 'days', label: '天数', width: 80 },
  { prop: 'priceCents', label: '售价', width: 90, slot: 'price' },
  { prop: 'status', label: '状态', width: 90, slot: 'status' },
  { prop: 'holder', label: '兑换账号', minWidth: 160, slot: 'holder' },
  { prop: 'redeemedAt', label: '兑换时间', minWidth: 170, slot: 'redeemedAt' },
  { prop: 'expiresAt', label: '账号到期时间', minWidth: 170, slot: 'expiresAt' },
  { prop: 'device', label: '当前设备', minWidth: 120, slot: 'device' },
  { prop: 'actions', label: '操作', minWidth: 160, slot: 'actions' }
];

const keyword = ref('');
const rows = ref<Card[]>([]);
const loading = ref(false);
const lastBatch = ref<string[]>([]);
const generateVisible = ref(false);
const shopVisible = ref(false);
const shopUrlInput = ref('');
const shopLoading = ref(false);
const shopSaving = ref(false);

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
  pageSizes: [10, 20, 50, 100]
});

let request = 0;

async function list() {
  const revision = ++request;
  loading.value = true;
  try {
    const { data } = await nestRequest<{ items: Card[]; total: number }>({
      url: '/admin/photo-cards/search',
      method: 'post',
      data: {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        search: keyword.value.trim() || undefined
      }
    });
    if (data && revision === request) {
      rows.value = data.items;
      pagination.total = data.total;
    }
  } finally {
    if (revision === request) loading.value = false;
  }
}

function onSearch(form: Record<string, unknown>) {
  keyword.value = String(form.keyword ?? '');
  pagination.currentPage = 1;
  void list();
}

async function onGenerateSubmit(form: Record<string, unknown>) {
  const price = form.price;
  const { data, error } = await nestRequest<{ codes: string[] }>({
    url: '/admin/photo-cards/generate',
    method: 'post',
    data: {
      count: Number(form.count),
      days: Number(form.days),
      priceCents: price == null || price === '' ? undefined : Math.round(Number(price) * 100)
    }
  });
  if (error || !data) return;
  lastBatch.value = data.codes;
  ElMessage.success(`已生成 ${data.codes.length} 张时长卡`);
  generateVisible.value = false;
  pagination.currentPage = 1;
  await list();
}

function exportBatch() {
  const url = URL.createObjectURL(
    new Blob([lastBatch.value.join('\r\n')], { type: 'text/plain;charset=utf-8' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = '洗图时长卡.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function openShop() {
  shopVisible.value = true;
  shopLoading.value = true;
  shopUrlInput.value = '';
  const { data, error } = await nestRequest<{ shopUrl: string | null }>({
    url: '/admin/photo-cards/shop',
    method: 'get'
  });
  shopLoading.value = false;
  if (error || !data) return;
  shopUrlInput.value = data.shopUrl ?? '';
}

async function saveShop() {
  shopSaving.value = true;
  const { error } = await nestRequest({
    url: '/admin/photo-cards/shop',
    method: 'patch',
    data: { shopUrl: shopUrlInput.value.trim() }
  });
  shopSaving.value = false;
  if (error) return;
  ElMessage.success('洗图时长卡购买链接已保存');
  shopVisible.value = false;
}

async function action(id: string, kind: 'void' | 'release' | 'suspend' | 'restore', label: string) {
  try {
    await ElMessageBox.confirm(`确认${label}？`, '会员管理');
  } catch {
    return;
  }
  const { error } = await nestRequest({
    url: `/admin/photo-cards/${kind === 'void' ? 'void' : 'member'}`,
    method: 'post',
    data: kind === 'void' ? { code: id } : { userId: id, action: kind }
  });
  if (!error) await list();
}

function statusLabel(row: Card) {
  if (row.voidedAt) return '已作废';
  if (row.redeemedAt) return '已兑换';
  return '未兑换';
}

function priceLabel(cents: number | null) {
  return cents == null ? '—' : (cents / 100).toFixed(2);
}

function timeLabel(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : '—';
}

function deviceLabel(row: Card) {
  const membership = row.holder?.photoMembership;
  if (!membership?.leaseUntil || Date.parse(membership.leaseUntil) <= Date.now()) return '—';
  return membership.deviceId || '—';
}
</script>

<template>
  <div class="photo-cards">
    <JQSearch :form-items="searchItems" @search="onSearch" />
    <JQDataTable
      :columns="columns"
      :data="rows"
      :loading="loading"
      :pagination="pagination"
      module-name="洗图时长卡"
      class="min-h-0 flex-1"
      row-key="code"
      @refresh="list"
      @pagination-change="
        ({ currentPage, pageSize }) => {
          pagination.currentPage = currentPage;
          pagination.pageSize = pageSize;
          list();
        }
      "
    >
      <template #header-prefix>
        <ElButton type="primary" @click="generateVisible = true">生成时长卡</ElButton>
        <ElButton @click="openShop">配置购买链接</ElButton>
        <ElButton :disabled="!lastBatch.length" @click="exportBatch">导出本次卡密</ElButton>
      </template>
      <template #code="{ row }">
        <span class="code-cell">{{ row.code }}</span>
      </template>
      <template #price="{ row }">{{ priceLabel(row.priceCents) }}</template>
      <template #status="{ row }">{{ statusLabel(row) }}</template>
      <template #holder="{ row }">{{ row.holder?.email || '—' }}</template>
      <template #redeemedAt="{ row }">{{ timeLabel(row.redeemedAt) }}</template>
      <template #expiresAt="{ row }">{{ timeLabel(row.holder?.photoMembership?.expiresAt) }}</template>
      <template #device="{ row }">{{ deviceLabel(row) }}</template>
      <template #actions="{ row }">
        <ElButton v-if="!row.voidedAt && !row.redeemedAt" link type="primary" @click="action(row.code, 'void', '作废这张卡')">
          作废
        </ElButton>
        <template v-if="row.holder?.photoMembership && row.redeemedBy">
          <ElButton
            link
            type="primary"
            @click="
              action(
                row.redeemedBy,
                row.holder.photoMembership.suspended ? 'restore' : 'suspend',
                '更改会员状态'
              )
            "
          >
            {{ row.holder.photoMembership.suspended ? '恢复会员' : '停用会员' }}
          </ElButton>
          <ElButton link type="primary" @click="action(row.redeemedBy, 'release', '释放设备占用')">释放占用</ElButton>
        </template>
      </template>
    </JQDataTable>

    <JQDialogForm
      v-model="generateVisible"
      title="生成时长卡"
      :form-items="generateItems"
      :initial-data="generateInitial"
      width="520px"
      :close-on-click-modal="false"
      :on-submit="onGenerateSubmit"
    >
      <template #days="{ form }">
        <div class="days-field">
          <ElInputNumber v-model="form.days" :min="1" :max="36500" :precision="0" :step="1" />
          <ElButton link type="primary" @click="form.days = 7">7 天</ElButton>
          <ElButton link type="primary" @click="form.days = 30">30 天</ElButton>
        </div>
      </template>
    </JQDialogForm>

    <ElDialog v-model="shopVisible" title="时长卡购买链接" width="520px" :close-on-click-modal="false">
      <ElForm v-loading="shopLoading" label-width="96px" @submit.prevent="saveShop">
        <ElFormItem label="购买链接">
          <ElInput v-model="shopUrlInput" placeholder="可留空，线下发卡" maxlength="2048" clearable />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="shopVisible = false">{{ $t('common.cancel') }}</ElButton>
        <ElButton type="primary" :loading="shopSaving" @click="saveShop">{{ $t('common.confirm') }}</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.photo-cards {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
}

.days-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-cell {
  font-family: ui-monospace, monospace;
}
</style>
