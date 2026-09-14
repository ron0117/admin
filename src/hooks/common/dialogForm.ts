import { computed, ref } from 'vue';
import type { FormItem } from '@/components';

export interface UseDialogFormOptions<T> {
  title?: string;
  titleEdit?: string;
  formItems: FormItem[] | (() => FormItem[]);
  onSubmit?: (data: T) => Promise<void> | void;
  onClose?: () => void;
  initialData?: Record<string, any>;
  width?: string;
  labelWidth?: string;
  inline?: boolean;
  disabled?: boolean;
}

export function useDialogForm<T = Record<string, any>>(options: UseDialogFormOptions<T>) {
  const {
    title: _title,
    titleEdit: _titleEdit,
    formItems: _formItems,
    onSubmit: _onSubmit,
    onClose: _onClose,
    initialData: _initialData,
    disabled: optionsDisabled,
    ...rest
  } = options;
  const dialogVisible = ref(false);
  const title = ref('新增');
  const initialData = ref();
  const formItems = ref<FormItem[]>([]);
  /** 是否禁用表单（检视模式等）；勿对只读 computed 的 dialogProps 赋值，应改此 ref */
  const formDisabled = ref(optionsDisabled ?? false);

  // 初始化或更新 formItems
  const updateFormItems = () => {
    if (typeof options.formItems === 'function') {
      formItems.value = options.formItems();
    } else {
      formItems.value = options.formItems;
    }
  };

  // 监听 options.formItems 变化（如果是函数）
  if (typeof options.formItems === 'function') {
    // 立即执行一次
    updateFormItems();

    // 如果是响应式依赖，这里可以添加 watch
  }

  const openDialog = (data?: T) => {
    if (data) {
      initialData.value = { ...options.initialData, ...data };
      title.value = options.titleEdit || '修改';
    } else {
      initialData.value = { ...options.initialData };
      title.value = options.title || '新增';
    }
    dialogVisible.value = true;
  };

  const closeDialog = () => {
    dialogVisible.value = false;
  };

  const handleSubmit = async (data: T) => {
    try {
      if (options.onSubmit) {
        await options.onSubmit(data);
      }
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  const handleClose = () => {
    if (options.onClose) {
      options.onClose();
    }
    closeDialog();
  };

  return {
    dialogVisible,
    openDialog,
    closeDialog,
    handleSubmit,
    handleClose,
    updateFormItems, // 暴露更新方法
    /** 与 JQDialogForm / JQForm 的 `disabled` 同步，用于新增/编辑/检视切换 */
    formDisabled,
    dialogProps: computed(() => ({
      title: title.value,
      formItems: formItems.value,
      initialData: initialData.value,
      modelValue: dialogVisible.value,
      'onUpdate:modelValue': (val: boolean) => {
        dialogVisible.value = val;
      },
      ...rest,
      disabled: formDisabled.value,
      onSubmit: handleSubmit,
      onClose: handleClose
    }))
  };
}
