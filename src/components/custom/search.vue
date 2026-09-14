<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue';
import { type FormItem, JQForm, type TFormProps } from '@/components';
import { $t } from '@/locales';

defineOptions({ name: 'JQSearch' });

type TSearchProps = Omit<TFormProps, 'modelValue'> & {
  modelValue?: Record<string, any>;

  /** 是否显示搜索 */
  showSearch?: boolean;
  /** 查询按钮字段 */
  searchText?: string;
  /** 是否显示重置 */
  showReset?: boolean;
  /** 重置按钮字段 */
  resetText?: string;
  /** 是否新增重置 */
  showAdd?: boolean;
  /** 重置按钮字段 */
  addText?: string;
};

interface Emits {
  (e: 'update:modelValue', data: Record<string, any>): void;
  /** 查询 */
  (e: 'search', data: Record<string, any>): void;
  /** 新增 */
  (e: 'add'): void;
  /** 重置 */
  (e: 'reset'): void;
  /** 字段更新 */
  (e: 'field-change', payload: { prop: string; value: any; item: FormItem }): void;
}

const props = withDefaults(defineProps<TSearchProps>(), {
  formItems: () => [],
  labelWidth: '100px',
  initialData: () => ({}),
  rules: () => ({}),
  inline: true,
  showSearch: true,
  searchText: '',
  showReset: true,
  resetText: '',
  showAdd: false,
  addText: ''
});

const formBindProps = computed(() => {
  const { modelValue: _modelValue, ...rest } = props;
  return {
    ...rest,
    model: formData.value
  };
});

const emit = defineEmits<Emits>();

const formData = ref<Record<string, any>>({});

const activeName = ref<string>('search');

const formContentRef = shallowRef<typeof JQForm>();

const search = () => {
  emit('search', formData.value);
};

const reset = () => {
  formContentRef.value?.resetFields();

  emit('reset');
};

const add = () => {
  emit('add');
};

/**
 * JQForm 的 model 任意路径更新（输入、选择、清除等）都同步给外部 v-model
 */
const handleModelUpdate = (newVal: Record<string, any>) => {
  formData.value = newVal;
  emit('update:modelValue', { ...newVal });
};

const handleFieldChange = (payload: { prop: string; value: any; item: FormItem }) => {
  emit('field-change', payload);
};

watch(
  () => props.modelValue,
  newVal => {
    formData.value = { ...formData.value, ...newVal };
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  nextTick(() => {
    formContentRef.value?.initFormData();
    formContentRef.value?.clearValidate();
  });
});
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse v-model="activeName">
      <ElCollapseItem :title="$t('common.search')" name="search">
        <JQForm
          ref="formContentRef"
          :model-value="formData"
          v-bind="formBindProps"
          @update:model-value="handleModelUpdate"
          @field-change="handleFieldChange"
        />
        <ElSpace class="w-full justify-end">
          <ElButton v-if="showSearch" type="primary" plain @click="search">
            <template #icon>
              <icon-ic-round-search class="text-icon" />
            </template>
            {{ searchText || $t('common.search') }}
          </ElButton>
          <ElButton v-if="showReset" @click="reset">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ resetText || $t('common.reset') }}
          </ElButton>
          <ElButton v-if="showAdd" type="success" plain @click="add">
            {{ addText || $t('common.add') }}
          </ElButton>
          <!-- 自定义插槽 -->
          <slot />
        </ElSpace>
      </ElCollapseItem>
    </ElCollapse>
  </ElCard>
</template>

<style scoped lang="scss"></style>
