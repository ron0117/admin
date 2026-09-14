<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { type FormItem, JQForm, type TFormProps } from '@/components';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

type TDialogFormProps = Omit<TFormProps, 'modelValue'> & {
  // 对话框标题
  title: string;
  // 表单初始数据
  initialData?: Record<string, any>;
  // 对话框宽度
  width?: string;
  // 确认按钮文字
  confirmText?: string;
  // 是否显示对话框
  modelValue: boolean;
  // 提交回调（优先于 submit 事件，支持 await 以维持确认按钮 loading）
  onSubmit?: (data: any) => Promise<void> | void;
  // 关闭回调（避免透传到 JQForm）
  onClose?: () => void;
};

type TDialogFormEmits = {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: any): void | Promise<void>;
  (e: 'close'): void;
  (e: 'field-change', payload: { prop: string; value: any; item: FormItem }): void;
};

const appStore = useAppStore();

const props = withDefaults(defineProps<TDialogFormProps>(), {
  labelWidth: '100px',
  confirmText: $t('common.confirm'),
  initialData: () => ({}),
  rules: () => ({}),
  inline: true,
  showMessage: true
});

const formBindProps = computed(() => {
  const { modelValue: _modelValue, onSubmit: _submit, onClose: _onClose, ...rest } = props;
  return {
    ...rest,
    model: formData.value
  };
});

const emit = defineEmits<TDialogFormEmits>();

// 注意：defineProps/withDefaults 会被编译期提升，不能在默认值里引用运行时的 store 实例
const dialogWidth = computed(() => (appStore.isMobile ? '90%' : (props.width ?? '800px')));

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

const loading = ref(false);
const formContentRef = ref<InstanceType<typeof JQForm>>();
const formData = ref<Record<string, any>>({});

// 监听对话框显示状态
watch(visible, newVal => {
  if (newVal) {
    nextTick(() => {
      if (formContentRef.value) {
        formContentRef.value.initFormData();
        formContentRef.value.clearValidate();
      }
    });
  }
});

/** 字段变化处理 */
const handleFieldChange = (payload: { prop: string; value: any; item: FormItem }) => {
  emit('field-change', payload);
};

/** 提交表单 */
const handleSubmit = async () => {
  if (!formContentRef.value || loading.value) return;

  try {
    loading.value = true;
    const isValid = await formContentRef.value.validate();

    if (isValid) {
      // slot 表单项会原地修改 JQForm 内部 formData，未必触发 v-model 同步，提交必须以子组件快照为准
      const fromForm = formContentRef.value.getFormData() ?? formData.value;
      const payload = { ...props.initialData, ...fromForm };

      if (props.onSubmit) {
        await props.onSubmit(payload);
      } else {
        emit('submit', payload);
      }
    }
  } catch (error) {
    console.error('表单提交失败:', error);
  } finally {
    loading.value = false;
  }
};

/** 关闭对话框 */
const handleClose = () => {
  visible.value = false;
  if (props.onClose) {
    props.onClose();
  } else {
    emit('close');
  }
};

/** 暴露方法给父组件 */
const validate = async () => {
  if (formContentRef.value) {
    return await formContentRef.value.validate();
  }
  return false;
};

/** 清空校验 */
const clearValidate = () => {
  if (formContentRef.value) {
    formContentRef.value.clearValidate();
  }
};

/** 重置校验 */
const resetForm = () => {
  if (formContentRef.value) {
    formContentRef.value.resetFields();
  }
};

/** 获取表单数据 */
const getFormData = () => {
  if (formContentRef.value) {
    return formContentRef.value.getFormData();
  }
  return formData.value;
};

/** 表单赋值 */
const setFieldValue = (field: string, value: any) => {
  formData.value = { ...formData.value, [field]: value };
};

defineExpose({
  validate,
  clearValidate,
  resetForm,
  getFormData,
  setFieldValue
});
</script>

<template>
  <ElDialog
    v-model="visible"
    :title="title"
    :width="dialogWidth"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <JQForm ref="formContentRef" v-model="formData" v-bind="formBindProps" @field-change="handleFieldChange">
      <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </JQForm>

    <template #footer>
      <span class="dialog-footer">
        <ElButton :disabled="loading" @click="handleClose">{{ $t('common.cancel') }}</ElButton>
        <ElButton v-if="!formBindProps.disabled" type="primary" :loading="loading" @click="handleSubmit">
          {{ confirmText }}
        </ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
