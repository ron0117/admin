<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQSearch } from '@/components';
import { createIpBlock, fetchIpBlocklist, reblockIp, unblockIp, updateIpBlock } from '@/service/api';

defineOptions({ name: 'IpBlocklist' });

const loading = ref(false);
const saving = ref(false);
const rows = ref<Api.IpBlocklist.Item[]>([]);
const dialogVisible = ref(false);
const editingId = ref<string>();
const formRef = ref<FormInstance>();
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 });
const query = reactive<{ keyword: string; status: '' | Api.IpBlocklist.Status }>({ keyword: '', status: '' });
const form = reactive({ network: '', reason: '', remark: '', temporary: false, expiresAt: '' });

const searchItems = computed<FormItem[]>(() => [
  { prop: 'keyword', label: '关键词', type: 'input', placeholder: 'IP、CIDR、原因或备注' },
  { prop: 'status', label: '状态', type: 'select', clearable: true, options: [
    { label: '生效中', value: 'ACTIVE' }, { label: '已过期', value: 'EXPIRED' }, { label: '已解除', value: 'UNBLOCKED' }
  ] }
]);
const columns = computed(() => [
  { prop: 'network', label: 'IP / CIDR', minWidth: 180 },
  { prop: 'effectiveStatus', label: '状态', minWidth: 95, slot: 'status' },
  { prop: 'reason', label: '封禁原因', minWidth: 190 },
  { prop: 'expiresAt', label: '到期时间', minWidth: 170, slot: 'expiresAt' },
  { prop: 'hitCount', label: '拦截次数', minWidth: 95 },
  { prop: 'lastHitAt', label: '最近拦截', minWidth: 170, slot: 'lastHitAt' },
  { prop: 'createdByAdmin', label: '添加人', minWidth: 160, slot: 'createdBy' },
  { prop: 'createdAt', label: '添加时间', minWidth: 170, formatTime: true },
  { prop: 'actions', label: '操作', minWidth: 180, fixed: 'right', slot: 'actions' }
]);
const rules: FormRules = {
  network: [{ required: true, message: '请输入 IP 或 CIDR', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入封禁原因', trigger: 'blur' }],
  expiresAt: [{ validator: (_rule, value, callback) => {
    if (form.temporary && !value) callback(new Error('请选择到期时间')); else callback();
  }, trigger: 'change' }]
};

function formatTime(value: string | null) { return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '—'; }
function statusText(status: Api.IpBlocklist.Status) { return ({ ACTIVE: '生效中', EXPIRED: '已过期', UNBLOCKED: '已解除' } as const)[status]; }
function statusType(status: Api.IpBlocklist.Status) { return status === 'ACTIVE' ? 'danger' : status === 'EXPIRED' ? 'warning' : 'info'; }
const blockRow = (row: unknown) => row as Api.IpBlocklist.Item;

async function loadList() {
  loading.value = true;
  const { data, error } = await fetchIpBlocklist({
    page: pagination.currentPage, pageSize: pagination.pageSize,
    keyword: query.keyword.trim() || undefined, status: query.status || undefined
  });
  loading.value = false;
  if (error || !data) return;
  rows.value = data.items;
  pagination.total = data.total;
}
function onSearch(data: Record<string, unknown>) {
  query.keyword = String(data.keyword || '');
  query.status = (data.status as Api.IpBlocklist.Status) || '';
  pagination.currentPage = 1;
  loadList();
}
function resetForm() {
  editingId.value = undefined;
  Object.assign(form, { network: '', reason: '', remark: '', temporary: false, expiresAt: '' });
  formRef.value?.clearValidate();
}
function openCreate() { resetForm(); dialogVisible.value = true; }
function openEdit(row: Api.IpBlocklist.Item) {
  editingId.value = row.id;
  Object.assign(form, {
    network: row.network, reason: row.reason, remark: row.remark || '',
    temporary: Boolean(row.expiresAt), expiresAt: row.expiresAt ? dayjs(row.expiresAt).format('YYYY-MM-DD HH:mm:ss') : ''
  });
  dialogVisible.value = true;
}
async function save() {
  if (!(await formRef.value?.validate().catch(() => false))) return;
  saving.value = true;
  const payload = {
    network: form.network.trim(), reason: form.reason.trim(), remark: form.remark.trim() || undefined,
    expiresAt: form.temporary ? dayjs(form.expiresAt).toISOString() : undefined
  };
  const result = editingId.value
    ? await updateIpBlock(editingId.value, { ...payload, expiresAt: form.temporary ? payload.expiresAt : null })
    : await createIpBlock(payload);
  saving.value = false;
  if (result.error) return;
  window.$message?.success(editingId.value ? '黑名单已更新' : '黑名单已添加');
  dialogVisible.value = false;
  await loadList();
}
async function unblock(row: Api.IpBlocklist.Item) {
  try {
    const { value } = await ElMessageBox.prompt(`确认解除 ${row.network} 的封禁？`, '解除封禁', {
      inputPlaceholder: '请输入解除原因', inputValidator: value => Boolean(value.trim()) || '请输入解除原因', confirmButtonText: '解除'
    });
    const { error } = await unblockIp(row.id, value.trim());
    if (!error) { window.$message?.success('已解除封禁'); await loadList(); }
  } catch { /* 用户取消 */ }
}
async function reblock(row: Api.IpBlocklist.Item) {
  try {
    await ElMessageBox.confirm(`确认重新封禁 ${row.network}？将按永久封禁恢复。`, '重新封禁', { type: 'warning' });
    const { error } = await reblockIp(row.id, { expiresAt: null });
    if (!error) { window.$message?.success('已重新封禁'); await loadList(); }
  } catch { /* 用户取消 */ }
}

onMounted(loadList);
</script>

<template>
  <JQCustomPage>
    <div class="mb-12px flex justify-end">
      <ElButton type="primary" @click="openCreate">新增黑名单</ElButton>
    </div>
    <JQSearch :form-items="searchItems" :initial-data="{ keyword: '', status: '' }" @search="onSearch" @reset="onSearch({})" />
    <JQDataTable
      :data="rows" :columns="columns" :loading="loading" :pagination="pagination" module-name="IP 黑名单"
      class="min-h-0 flex-1" row-key="id" @refresh="loadList"
      @pagination-change="({ currentPage, pageSize }) => { pagination.currentPage = currentPage; pagination.pageSize = pageSize; loadList(); }"
    >
      <template #status="{ row }"><ElTag :type="statusType(row.effectiveStatus)" size="small">{{ statusText(row.effectiveStatus) }}</ElTag></template>
      <template #expiresAt="{ row }">{{ row.expiresAt ? formatTime(row.expiresAt) : '永久' }}</template>
      <template #lastHitAt="{ row }">{{ formatTime(row.lastHitAt) }}</template>
      <template #createdBy="{ row }">{{ row.createdByAdmin?.email || '—' }}</template>
      <template #actions="{ row }">
        <ElButton v-if="row.effectiveStatus === 'ACTIVE'" link type="primary" @click="openEdit(blockRow(row))">编辑</ElButton>
        <ElButton v-if="row.effectiveStatus === 'ACTIVE'" link type="danger" @click="unblock(blockRow(row))">解除</ElButton>
        <ElButton v-else link type="warning" @click="reblock(blockRow(row))">重新封禁</ElButton>
      </template>
    </JQDataTable>

    <ElDialog v-model="dialogVisible" :title="editingId ? '编辑黑名单' : '新增黑名单'" width="560px" destroy-on-close>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px">
        <ElFormItem label="IP / CIDR" prop="network"><ElInput v-model="form.network" placeholder="例如 1.2.3.4 或 10.0.0.0/24" /></ElFormItem>
        <ElFormItem label="封禁原因" prop="reason"><ElInput v-model="form.reason" maxlength="300" show-word-limit /></ElFormItem>
        <ElFormItem label="备注"><ElInput v-model="form.remark" type="textarea" maxlength="500" show-word-limit /></ElFormItem>
        <ElFormItem label="有效期"><ElSwitch v-model="form.temporary" active-text="临时封禁" inactive-text="永久封禁" /></ElFormItem>
        <ElFormItem v-if="form.temporary" label="到期时间" prop="expiresAt">
          <ElDatePicker v-model="form.expiresAt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" class="w-full" />
        </ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" :loading="saving" @click="save">保存</ElButton></template>
    </ElDialog>
  </JQCustomPage>
</template>
