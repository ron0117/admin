<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm } from '@/components';
import { fetchPatchPointFeature, fetchPointFeatures } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'PointsSettings' });

const LIVE_MENU = 'generate.create.live';

const loading = ref(false);
const rows = ref<Api.Points.Feature[]>([]);
const formVisible = ref(false);
const editing = ref<Api.Points.Feature | null>(null);

const columns = computed(() => [
  { prop: 'name', label: $t('page.points.settings.feature'), minWidth: 140 },
  { prop: 'pointsSummary', label: $t('page.points.settings.points'), minWidth: 220, slot: 'pointsSummary' },
  { prop: 'remark', label: $t('page.points.settings.remark'), minWidth: 180, slot: 'remark' },
  { prop: 'updatedAt', label: $t('page.points.settings.updatedAt'), minWidth: 170, formatTime: true },
  { prop: 'actions', label: $t('common.operate'), minWidth: 120, slot: 'actions', fixed: 'right' }
]);

const formItems = computed<FormItem[]>(() => {
  const isLive = editing.value?.menuCode === LIVE_MENU;
  const intRule = [
    {
      required: true,
      type: 'integer' as const,
      min: 0,
      message: $t('page.points.settings.unitInvalid'),
      trigger: 'blur'
    }
  ];
  const numberItem = (prop: string, label: string): FormItem => ({
    prop,
    label,
    type: 'number',
    span: 2,
    componentProps: { min: 0, step: 1, precision: 0, controls: true },
    rules: intRule
  });
  return [
    {
      prop: 'name',
      label: $t('page.points.settings.featureName'),
      type: 'input',
      disabled: true,
      span: 2
    },
    {
      prop: 'menuCode',
      label: $t('page.points.settings.menuCode'),
      type: 'input',
      disabled: true,
      span: 2
    },
    ...(isLive
      ? [
          numberItem('unitHigh', $t('page.points.settings.unitHigh')),
          numberItem('unitMedium', $t('page.points.settings.unitMedium')),
          numberItem('unitGood', $t('page.points.settings.unitGood'))
        ]
      : [numberItem('unitPoints', $t('page.points.settings.unitPoints'))]),
    {
      prop: 'remark',
      label: $t('page.points.settings.remark'),
      type: 'textarea',
      span: 2,
      componentProps: { maxlength: 200, showWordLimit: true, rows: 3 },
      rules: [{ max: 200, message: $t('page.points.settings.remarkMax'), trigger: 'blur' }]
    }
  ];
});

const formInitial = computed(() => {
  const row = editing.value;
  if (!row) {
    return {
      name: '',
      menuCode: '',
      unitPoints: 0,
      unitHigh: 0,
      unitMedium: 0,
      unitGood: 0,
      remark: ''
    };
  }
  const byKey = (key: string) => row.specs.find(spec => spec.specKey === key)?.unitPoints ?? 0;
  return {
    name: row.name,
    menuCode: row.menuCode,
    unitPoints: byKey('default'),
    unitHigh: byKey('high'),
    unitMedium: byKey('medium'),
    unitGood: byKey('good'),
    remark: row.remark ?? ''
  };
});

const specsSummary = (row: Api.Points.Feature) => {
  const high = row.specs.find(spec => spec.specKey === 'high');
  if (high) {
    const medium = row.specs.find(spec => spec.specKey === 'medium');
    const good = row.specs.find(spec => spec.specKey === 'good');
    return $t('page.points.settings.liveSummary', {
      high: high.unitPoints,
      medium: medium?.unitPoints ?? 0,
      good: good?.unitPoints ?? 0
    });
  }
  const def = row.specs.find(spec => spec.specKey === 'default');
  return $t('page.points.settings.defaultSummary', { n: def?.unitPoints ?? 0 });
};

const featureRow = (row: unknown) => row as Api.Points.Feature;

const loadList = async () => {
  loading.value = true;
  const { data, error } = await fetchPointFeatures();
  loading.value = false;
  if (error || !data) {
    return;
  }
  rows.value = data.items;
};

const openEdit = (row: Api.Points.Feature) => {
  editing.value = row;
  formVisible.value = true;
};

const handleFormSubmit = async (data: Record<string, unknown>) => {
  if (!editing.value) {
    return;
  }
  const isLive = editing.value.menuCode === LIVE_MENU;
  const specs = isLive
    ? [
        { specKey: 'high', unitPoints: Number(data.unitHigh) },
        { specKey: 'medium', unitPoints: Number(data.unitMedium) },
        { specKey: 'good', unitPoints: Number(data.unitGood) }
      ]
    : [{ specKey: 'default', unitPoints: Number(data.unitPoints) }];
  const remark = String(data.remark ?? '');
  const { error } = await fetchPatchPointFeature(editing.value.menuCode, { remark, specs });
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  formVisible.value = false;
  await loadList();
};

onMounted(() => {
  loadList();
});
</script>

<template>
  <JQCustomPage>
    <p class="mb-8px text-13px text-gray-500">{{ $t('page.points.settings.priceHint') }}</p>
    <JQDataTable
      :data="rows"
      :columns="columns"
      :loading="loading"
      :show-pagination="false"
      :module-name="$t('page.points.settings.title')"
      class="min-h-0 flex-1"
      row-key="id"
      @refresh="loadList"
    >
      <template #pointsSummary="{ row }">
        {{ specsSummary(featureRow(row)) }}
      </template>
      <template #remark="{ row }">
        {{ featureRow(row).remark || '—' }}
      </template>
      <template #actions="{ row }">
        <ElButton type="primary" plain size="small" @click="openEdit(featureRow(row))">
          {{ $t('common.modify') }}
        </ElButton>
      </template>
    </JQDataTable>

    <JQDialogForm
      v-model="formVisible"
      :title="$t('page.points.settings.editTitle')"
      :form-items="formItems"
      :initial-data="formInitial"
      width="560px"
      :close-on-click-modal="false"
      :on-submit="handleFormSubmit"
    />
  </JQCustomPage>
</template>
