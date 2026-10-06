<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm } from '@/components';
import {
  fetchCreateRechargePackage,
  fetchDeleteRechargePackage,
  fetchPatchRechargePackage,
  fetchRechargePackages
} from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'PointsRechargePackages' });

const loading = ref(false);
const rows = ref<Api.Recharge.Package[]>([]);
const formVisible = ref(false);
const editing = ref<Api.Recharge.Package | null>(null);

const columns = computed(() => [
  { prop: 'sort', label: $t('page.points.rechargePackages.sort'), width: 72 },
  { prop: 'amountYuan', label: $t('page.points.rechargePackages.amount'), minWidth: 100, slot: 'amountYuan' },
  { prop: 'basePoints', label: $t('page.points.rechargePackages.basePoints'), minWidth: 100 },
  { prop: 'bonusPoints', label: $t('page.points.rechargePackages.bonusPoints'), minWidth: 100 },
  { prop: 'totalPoints', label: $t('page.points.rechargePackages.totalPoints'), minWidth: 100 },
  { prop: 'onShelf', label: $t('page.points.rechargePackages.onShelf'), minWidth: 90, slot: 'onShelf' },
  { prop: 'updatedAt', label: $t('page.points.rechargePackages.updatedAt'), minWidth: 170, formatTime: true },
  { prop: 'actions', label: $t('common.operate'), minWidth: 160, slot: 'actions', fixed: 'right' }
]);

const formItems = computed<FormItem[]>(() => [
  {
    prop: 'amountYuan',
    label: $t('page.points.rechargePackages.amount'),
    type: 'number',
    span: 2,
    componentProps: { min: 1, step: 1, precision: 0, controls: true },
    rules: [{ required: true, type: 'number', min: 1, message: $t('page.points.rechargePackages.amountInvalid'), trigger: 'blur' }]
  },
  {
    prop: 'basePoints',
    label: $t('page.points.rechargePackages.basePoints'),
    type: 'number',
    span: 2,
    componentProps: { min: 0, step: 1, precision: 0, controls: true },
    rules: [{ required: true, type: 'number', min: 0, trigger: 'blur' }]
  },
  {
    prop: 'bonusPoints',
    label: $t('page.points.rechargePackages.bonusPoints'),
    type: 'number',
    span: 2,
    componentProps: { min: 0, step: 1, precision: 0, controls: true }
  },
  {
    prop: 'sort',
    label: $t('page.points.rechargePackages.sort'),
    type: 'number',
    span: 2,
    componentProps: { step: 1, precision: 0, controls: true }
  },
  {
    prop: 'onShelf',
    label: $t('page.points.rechargePackages.onShelf'),
    type: 'switch',
    span: 2
  }
]);

const formInitial = computed(() => {
  const row = editing.value;
  if (!row) {
    return { amountYuan: 100, basePoints: 100, bonusPoints: 0, sort: 0, onShelf: true };
  }
  return {
    amountYuan: Math.round(row.amountCents / 100),
    basePoints: row.basePoints,
    bonusPoints: row.bonusPoints,
    sort: row.sort,
    onShelf: row.onShelf
  };
});

const packageRow = (row: unknown) => row as Api.Recharge.Package;

function formatYuan(cents: number): string {
  return (cents / 100).toFixed(2);
}

async function load() {
  loading.value = true;
  const { data, error } = await fetchRechargePackages();
  loading.value = false;
  if (error || !data) return;
  rows.value = data.items;
}

function openCreate() {
  editing.value = null;
  formVisible.value = true;
}

function openEdit(row: Api.Recharge.Package) {
  editing.value = row;
  formVisible.value = true;
}

async function onSubmit(form: Record<string, unknown>) {
  const amountYuan = Number(form.amountYuan);
  const payload = {
    amountCents: Math.round(amountYuan * 100),
    basePoints: Number(form.basePoints),
    bonusPoints: Number(form.bonusPoints ?? 0),
    sort: Number(form.sort ?? 0),
    onShelf: Boolean(form.onShelf)
  };
  if (editing.value) {
    const { error } = await fetchPatchRechargePackage(editing.value.id, payload);
    if (error) return;
  } else {
    const { error } = await fetchCreateRechargePackage(payload);
    if (error) return;
  }
  window.$message?.success(
    editing.value ? $t('common.modifySuccess') : $t('common.addSuccess')
  );
  formVisible.value = false;
  await load();
}

async function onDelete(row: Api.Recharge.Package) {
  try {
    await ElMessageBox.confirm(
      $t('page.points.rechargePackages.deleteConfirm'),
      $t('common.tip'),
      { type: 'warning', confirmButtonText: $t('common.confirm'), cancelButtonText: $t('common.cancel') }
    );
  } catch {
    return;
  }
  const { error } = await fetchDeleteRechargePackage(row.id);
  if (!error) await load();
}

onMounted(() => {
  void load();
});
</script>

<template>
  <JQCustomPage>
    <JQDataTable
      :data="rows"
      :columns="columns"
      :loading="loading"
      :show-pagination="false"
      show-add
      :module-name="$t('page.points.rechargePackages.title')"
      class="min-h-0 flex-1"
      row-key="id"
      @refresh="load"
      @add="openCreate"
    >
      <template #amountYuan="{ row }">{{ formatYuan(packageRow(row).amountCents) }}</template>
      <template #onShelf="{ row }">
        <ElTag :type="packageRow(row).onShelf ? 'success' : 'info'">
          {{
            packageRow(row).onShelf
              ? $t('page.points.rechargePackages.shelfOn')
              : $t('page.points.rechargePackages.shelfOff')
          }}
        </ElTag>
      </template>
      <template #actions="{ row }">
        <ElButton type="primary" plain size="small" @click="openEdit(packageRow(row))">
          {{ $t('common.edit') }}
        </ElButton>
        <ElButton type="danger" plain size="small" @click="onDelete(packageRow(row))">
          {{ $t('common.delete') }}
        </ElButton>
      </template>
    </JQDataTable>

    <JQDialogForm
      v-model="formVisible"
      :title="editing ? $t('page.points.rechargePackages.editTitle') : $t('page.points.rechargePackages.createTitle')"
      :form-items="formItems"
      :initial-data="formInitial"
      width="560px"
      :close-on-click-modal="false"
      :on-submit="onSubmit"
    />
  </JQCustomPage>
</template>
