<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm } from '@/components';
import { fetchPatchPointFeature, fetchPointFeatures } from '@/service/api';
import { skillHintForMenu } from '@/constants/point-feature-skill-hint';
import { skillSpecForMenu } from '@/constants/point-feature-skill-spec';
import { stripSkillPromptParamLabels } from '@/utils/skill-prompt-strip';
import { $t } from '@/locales';

defineOptions({ name: 'PointsSettings' });

const LIVE_MENU = 'generate.create.live';
const COPYWRITE_MENU = 'generate.create.copywrite';

const loading = ref(false);
const rows = ref<Api.Points.Feature[]>([]);
const formVisible = ref(false);
const editing = ref<Api.Points.Feature | null>(null);

const editingSkillSpec = computed(() =>
  editing.value ? skillSpecForMenu(editing.value.menuCode) : undefined
);

const skillTextareaRows = computed(() => {
  const code = editing.value?.menuCode;
  if (code === 'generate.create.fission' || code === 'generate.create.live') {
    return 14;
  }
  return 8;
});

const columns = computed(() => [
  { prop: 'name', label: $t('page.points.settings.feature'), minWidth: 140 },
  { prop: 'pointsSummary', label: $t('page.points.settings.points'), minWidth: 220, slot: 'pointsSummary' },
  { prop: 'skillStatus', label: $t('page.points.settings.skillStatus'), minWidth: 100, slot: 'skillStatus' },
  { prop: 'remark', label: $t('page.points.settings.remark'), minWidth: 180, slot: 'remark' },
  { prop: 'updatedAt', label: $t('page.points.settings.updatedAt'), minWidth: 170, formatTime: true },
  { prop: 'actions', label: $t('common.operate'), minWidth: 120, slot: 'actions', fixed: 'right' }
]);

const formItems = computed<FormItem[]>(() => {
  const isLive = editing.value?.menuCode === LIVE_MENU;
  const isCopywrite = editing.value?.menuCode === COPYWRITE_MENU;
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
  const textareaItem = (
    prop: string,
    label: string,
    max: number,
    maxMessage: string,
    textareaRows: number
  ): FormItem => ({
    prop,
    label,
    type: 'textarea',
    span: 2,
    componentProps: { maxlength: max, showWordLimit: true, rows: textareaRows },
    rules: [{ max, message: maxMessage, trigger: 'blur' }]
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
    ...(isCopywrite
      ? []
      : [
          {
            prop: 'skillPrompt',
            label: $t('page.points.settings.skillPrompt'),
            type: 'slot',
            slotName: 'skillPromptField',
            span: 2,
            rules: [{ max: 4000, message: $t('page.points.settings.skillMax'), trigger: 'blur' }]
          } as FormItem
        ]),
    textareaItem('remark', $t('page.points.settings.remark'), 200, $t('page.points.settings.remarkMax'), 3)
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
      skillPrompt: '',
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
    skillPrompt: stripSkillPromptParamLabels(row.skillPrompt ?? ''),
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

const skillStatusLabel = (row: Api.Points.Feature) => {
  if (row.menuCode === COPYWRITE_MENU) {
    return $t('page.points.settings.skillNotConfigured');
  }
  return row.skillPrompt?.trim()
    ? $t('page.points.settings.skillConfigured')
    : $t('page.points.settings.skillNotConfigured');
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
  const isCopywrite = editing.value.menuCode === COPYWRITE_MENU;
  const specs = isLive
    ? [
        { specKey: 'high', unitPoints: Number(data.unitHigh) },
        { specKey: 'medium', unitPoints: Number(data.unitMedium) },
        { specKey: 'good', unitPoints: Number(data.unitGood) }
      ]
    : [{ specKey: 'default', unitPoints: Number(data.unitPoints) }];
  const remark = String(data.remark ?? '');
  const payload: Api.Points.PatchFeatureReq = { remark, specs };
  if (!isCopywrite) {
    payload.skillPrompt = stripSkillPromptParamLabels(String(data.skillPrompt ?? ''));
  }
  const { error } = await fetchPatchPointFeature(editing.value.menuCode, payload);
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
      <template #module-extra>
        <ElAlert :title="$t('page.points.settings.priceHint')" type="error" :closable="false" class="min-w-0 flex-1" />
      </template>
      <template #pointsSummary="{ row }">
        {{ specsSummary(featureRow(row)) }}
      </template>
      <template #skillStatus="{ row }">
        {{ skillStatusLabel(featureRow(row)) }}
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
      width="640px"
      :close-on-click-modal="false"
      :on-submit="handleFormSubmit"
    >
      <template #skillPromptField="{ form }">
        <div class="skill-prompt-editor">
          <ElInput
            v-model="form.skillPrompt"
            type="textarea"
            :rows="skillTextareaRows"
            maxlength="4000"
            show-word-limit
            :placeholder="skillHintForMenu(editing?.menuCode ?? '')"
          />
          <div v-if="editingSkillSpec" class="skill-param-panel">
            <p class="skill-param-panel__title">{{ $t('page.points.settings.skillParamTitle') }}</p>
            <p class="skill-param-panel__hint">{{ $t('page.points.settings.skillParamHint') }}</p>
            <div
              v-for="section in editingSkillSpec.sections"
              :key="section.key"
              class="skill-param-section"
            >
              <p v-if="editingSkillSpec.sections.length > 1" class="skill-param-section__head">
                【{{ section.key }}】{{ section.title }}
              </p>
              <ul class="skill-param-list">
                <li v-for="param in section.params" :key="param.key">
                  <code>${{ param.key }}</code>
                  <span class="skill-param-dash">—</span>
                  <span>{{ param.label }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </JQDialogForm>
  </JQCustomPage>
</template>

<style scoped>
.skill-prompt-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.skill-param-panel {
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.5;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.skill-param-panel__title {
  margin: 0 0 4px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.skill-param-panel__hint {
  margin: 0 0 8px;
  color: var(--el-text-color-secondary);
}

.skill-param-section + .skill-param-section {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.skill-param-section__head {
  margin: 0 0 6px;
  font-weight: 500;
}

.skill-param-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.skill-param-list li {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: baseline;
  margin-bottom: 4px;
}

.skill-param-list code {
  padding: 0 4px;
  font-size: 12px;
  background: var(--el-fill-color);
  border-radius: 4px;
}

.skill-param-dash {
  color: var(--el-text-color-secondary);
}
</style>
