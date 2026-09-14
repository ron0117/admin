<script setup lang="ts">
import { computed } from 'vue';
import { createI18nField } from '@/utils/common';
import { $t, type GlobalLangType, GlobalLangs } from '@/locales';

interface Props {
  /** 多语言输入值 */
  modelValue?: Record<GlobalLangType, string>;
  /** 输入框占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 输入框类型 */
  type?: 'text' | 'textarea';
  /** 文本域行数 */
  rows?: number;
  /** 最大长度 */
  maxlength?: number | string;
  /** 是否显示字数统计 */
  showWordLimit?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: Record<GlobalLangType, string>): void;
}

defineOptions({ name: 'I18nInput', inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => createI18nField(''),
  placeholder: '',
  disabled: false,
  type: 'text',
  rows: 3,
  showWordLimit: false,
  maxlength: undefined
});

const emit = defineEmits<Emits>();

/** 语言标签映射 */
const langLabelMap: Record<GlobalLangType, string> = {
  'zh-cn': $t('common.lang.zh-cn'),
  'zh-tw': $t('common.lang.zh-tw'),
  'en-us': $t('common.lang.en-us')
};

/** 标签页配置 - 从全局语言配置动态生成 */
const tabs = computed(() =>
  GlobalLangs.map((lang: GlobalLangType) => ({
    name: lang,
    label: langLabelMap[lang] || lang
  }))
);

/** 当前激活的标签 */
const activeTab = defineModel<string>('activeTab', { default: GlobalLangs[0] });

/** 计算属性：当前语言的值 */
const currentValue = computed({
  get: () => props.modelValue?.[activeTab.value as GlobalLangType] || '',
  set: (val: string) => {
    const newValue = { ...props.modelValue };
    newValue[activeTab.value as GlobalLangType] = val;
    emit('update:modelValue', newValue);
  }
});
</script>

<template>
  <div class="i18n-input w-full border rounded-2px p-5px">
    <ElTabs v-model="activeTab" type="card" class="i18n-input__tabs">
      <ElTabPane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
        <ElInput
          v-if="type === 'text'"
          v-model="currentValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :maxlength="maxlength"
          :show-word-limit="showWordLimit"
        />
        <ElInput
          v-else
          v-model="currentValue"
          type="textarea"
          :placeholder="placeholder"
          :disabled="disabled"
          :rows="rows"
          :maxlength="maxlength"
          :show-word-limit="showWordLimit"
        />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped lang="scss">
.i18n-input {
  width: 100%;

  &__tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 12px;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
    }

    :deep(.el-tabs__item) {
      font-size: 14px;
      color: #606266;

      &.is-active {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
