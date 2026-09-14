<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import type {
  ElAutocomplete,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElSelect,
  ElSwitch,
  ElTimePicker,
  FormInstance,
  FormProps,
  FormRules
} from 'element-plus';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { createI18nField } from '@/utils/common';
import I18nImage from '@/components/i18n/i18n-image.vue';
import I18nInput from '@/components/i18n/i18n-input.vue';

defineOptions({ name: 'JQForm', inheritAttrs: false });

/** 日期时间范围值格式（结束时间保留毫秒 .999） */
const DATETIMERANGE_VALUE_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

/** 日期时间范围：点选时默认开始 00:00:00.000、结束 23:59:59.999（仅日期部分以用户选择为准，年月日无意义） */
const DATETIMERANGE_DEFAULT_TIME: [Date, Date] = [
  new Date(2000, 0, 1, 0, 0, 0, 0),
  new Date(2000, 0, 1, 23, 59, 59, 999)
];

type FormItemType =
  | 'input'
  | 'autocomplete'
  | 'inputNumber'
  | 'textarea'
  | 'number'
  | 'select'
  | 'date'
  | 'datetime'
  | 'time'
  | 'switch'
  | 'radio'
  | 'checkbox'
  | 'slot'
  | 'datetimerange'
  | 'i18nInput'
  | 'i18nImage';

type ComponentPropsOf<TComponent> = TComponent extends new (...args: any[]) => { $props: infer TProps }
  ? TProps
  : never;

type FormItemComponentPropsMap = {
  input: ComponentPropsOf<typeof ElInput>;
  autocomplete: ComponentPropsOf<typeof ElAutocomplete>;
  inputNumber: ComponentPropsOf<typeof ElInput>;
  textarea: ComponentPropsOf<typeof ElInput>;
  number: ComponentPropsOf<typeof ElInputNumber>;
  select: ComponentPropsOf<typeof ElSelect>;
  date: ComponentPropsOf<typeof ElDatePicker>;
  datetime: ComponentPropsOf<typeof ElDatePicker>;
  time: ComponentPropsOf<typeof ElTimePicker>;
  switch: ComponentPropsOf<typeof ElSwitch>;
  radio: ComponentPropsOf<typeof ElRadioGroup>;
  checkbox: ComponentPropsOf<typeof ElCheckboxGroup>;
  slot: Record<string, never>;
  datetimerange: ComponentPropsOf<typeof ElDatePicker>;
  i18nInput: ComponentPropsOf<typeof I18nInput>;
  i18nImage: ComponentPropsOf<typeof I18nImage>;
};

/**
 * 表单项基础属性，已经复写过 ElFormItem 的属性
 */
type FormItemBase = {
  // 字段属性名
  prop: string;
  // 字段标签
  label: string;
  // 占位符
  placeholder?: string;
  // 默认值
  defaultValue?: any;
  // 验证规则
  rules?: FormRules[number];
  // 是否禁用
  disabled?: boolean;
  // 是否支持清除
  clearable?: boolean;
  // 栅格布局占用栏位；启用 span 布局后默认占 1 栏，span: 2 独占整行
  span?: number;

  // 触发改变事件
  onChange?: (value: any, formData: Record<string, any>, prop: string) => void | Promise<void>;

  /**
   * autocomplete 选中下拉项时的回调（payload 为整条建议项，便于把 id 等附加字段联动到其它字段）
   */
  onSelect?: (item: any, formData: Record<string, any>, prop: string) => void | Promise<void>;

  // 动态组件覆盖（不传则按 type 使用内置组件）
  component?: string | Component;

  // Checkbox 或 Radio 选项
  options?: TCommon.SelectItem[];

  // 插槽名称
  slotName?: string;
  // 是否显示
  show?: boolean;
};

/**
 * 表单项属性
 */
type TypedFormItem<T extends FormItemType> = FormItemBase & {
  type: T;
  // 当前字段组件 props（最高优先级）
  componentProps?: Partial<FormItemComponentPropsMap[T]>;
};

export type FormItem = {
  [T in FormItemType]: TypedFormItem<T>;
}[FormItemType];

type TEmits = {
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'field-change', payload: { prop: string; value: any; item: FormItem }): void;
};

type TOmit = 'model' | 'rules' | 'showMessage';

/**
 * 表单属性
 */
export type TFormProps = Partial<Omit<FormProps, TOmit>> & {
  // 表单配置项
  formItems: FormItem[];
  // 表单初始数据
  initialData?: Record<string, any>;
  // 表单验证规则
  rules?: FormRules;
  // 表单数据
  modelValue?: Record<string, any>;
  // 是否显示消息
  showMessage?: boolean;
};

const props = withDefaults(defineProps<TFormProps>(), {
  labelWidth: '100px',
  initialData: () => ({}),
  rules: () => ({}),
  inline: true,
  modelValue: () => ({}),
  labelPosition: 'right',
  showMessage: true
});

const emit = defineEmits<TEmits>();
const { t } = useI18n();

const formRef = ref<FormInstance>();
const formData = ref<Record<string, any>>({});

type DynamicComponentName =
  | 'ElInput'
  | 'ElAutocomplete'
  | 'ElInputNumber'
  | 'ElSelect'
  | 'ElDatePicker'
  | 'ElTimePicker'
  | 'ElSwitch'
  | 'ElRadioGroup'
  | 'ElCheckboxGroup';

// 同步外部传入的 modelValue
watch(
  () => props.modelValue,
  newVal => {
    formData.value = { ...props.initialData, ...newVal };
  },
  { immediate: true, deep: true }
);

// 合并验证规则
const rules = computed(() => {
  const mergedRules: FormRules = { ...props.rules };

  props.formItems.forEach(item => {
    if (item.rules) {
      mergedRules[item.prop] = item.rules;
    }
  });

  return mergedRules;
});

const formBindProps = computed(() => {
  const {
    formItems: _formItems,
    initialData: _initialData,
    modelValue: _modelValue,
    rules: _rules,
    ...inheritedFormProps
  } = props;

  return {
    model: formData.value,
    rules: rules.value,
    ...inheritedFormProps
  };
});

const useSpanLayout = computed(() => props.formItems.some(item => item.show !== false && item.span !== undefined));

const isI18nFormItem = (item: FormItem) => item.type === 'i18nInput' || item.type === 'i18nImage';

const getFormItemClass = (item: FormItem) => {
  if (!useSpanLayout.value) return '';

  const defaultSpan = isI18nFormItem(item) ? 2 : 1;
  const span = Math.min(Math.max(Number(item.span ?? defaultSpan), 1), 2);
  return span === 2 ? '!mr-0 col-span-1 sm:col-span-2' : '!mr-0 col-span-1';
};

// 初始化表单数据
const initFormData = () => {
  const data: Record<string, any> = {};

  props.formItems.forEach(item => {
    // 优先使用初始数据，其次使用默认值
    if (props.initialData && props.initialData[item.prop] !== undefined) {
      data[item.prop] = normalizeFieldValue(item, props.initialData[item.prop]);
    } else if (item.defaultValue !== undefined) {
      data[item.prop] = normalizeFieldValue(item, item.defaultValue);
    } else {
      // 根据类型设置默认值
      switch (item.type) {
        case 'number':
          data[item.prop] = 0;
          break;
        case 'switch':
          data[item.prop] = false;
          break;
        case 'checkbox':
          data[item.prop] = [];
          break;
        case 'select':
          // 多选 ElSelect 约定值为数组；与 checkbox 一致，勿用空字符串（否则与 multiple 语义不一致）
          data[item.prop] = item.componentProps?.multiple ? [] : '';
          break;
        case 'i18nInput':
          data[item.prop] = createI18nField('');
          break;
        case 'i18nImage':
          data[item.prop] = createI18nField<string | CommonType.I18nResourceConfig>({ img: '' });
          break;
        default:
          data[item.prop] = '';
      }
    }
  });

  formData.value = { ...props.initialData, ...data };
};

// 字段变化处理
const handleFieldChange = async (prop: string, value: any, item: FormItem) => {
  // 更新本地数据
  formData.value[prop] = value;

  // 触发 field-change 事件
  emit('field-change', { prop, value, item });

  // 执行字段特定的onChange回调
  if (item.onChange) {
    try {
      await item.onChange(value, { ...formData.value }, prop);
    } catch (error) {
      console.error(`字段 ${prop} 的 onChange 回调执行失败:`, error);
    }
  }

  // 触发相关字段的验证
  if (formRef.value) {
    formRef.value.validateField(prop);
  }
};

// 暴露方法给父组件
const validate = async () => {
  if (!formRef.value) return false;

  try {
    await formRef.value.validate();
    return true;
  } catch (error) {
    console.error('表单验证失败:', error);
    return false;
  }
};

/**
 * 清除表单验证
 */
const clearValidate = () => {
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

/**
 * 重置表单
 */
const resetFields = () => {
  if (formRef.value) {
    formRef.value.resetFields();
    initFormData();
    emit('update:modelValue', { ...formData.value });
  }
};

const getComponentName = (item: FormItem): DynamicComponentName | string | Component | '' => {
  if (item.component) return item.component;

  switch (item.type) {
    case 'autocomplete':
      return 'ElAutocomplete';
    case 'input':
    case 'textarea':
    case 'inputNumber':
      return 'ElInput';
    case 'number':
      return 'ElInputNumber';
    case 'select':
      return 'ElSelect';
    case 'date':
    case 'datetime':
    case 'datetimerange':
      return 'ElDatePicker';
    case 'time':
      return 'ElTimePicker';
    case 'switch':
      return 'ElSwitch';
    case 'radio':
      return 'ElRadioGroup';
    case 'checkbox':
      return 'ElCheckboxGroup';
    case 'i18nInput':
      return I18nInput;
    case 'i18nImage':
      return I18nImage;
    default:
      return '';
  }
};

/**
 * 获取组件属性
 * @param item 表单项
 * @returns 组件属性
 */
const getComponentProps = (item: FormItem) => {
  const formPlaceholder = item.placeholder || t('form.placeholder', { text: item.label });
  const selectPlaceholder = item.placeholder || t('form.select', { text: item.label });

  const defaultPropsBuilder: Partial<Record<FormItemType, () => Record<string, any>>> = {
    input: () => ({
      type: 'text',
      placeholder: formPlaceholder,
      disabled: item.disabled,
      clearable: item.clearable ?? true,
      class: item.span === 2 ? 'w-[90%]' : 'w-[180px]'
    }),
    autocomplete: () => ({
      placeholder: formPlaceholder,
      disabled: item.disabled,
      clearable: item.clearable ?? true,
      class: 'w-[180px]',
      /** 未传 `componentProps.fetchSuggestions` 时使用空列表，避免组件报错 */
      fetchSuggestions: (_query: string, cb: (data: { value: string }[]) => void) => {
        cb([]);
      }
    }),
    textarea: () => ({
      type: 'textarea',
      placeholder: formPlaceholder,
      disabled: item.disabled,
      clearable: item.clearable ?? true
    }),
    inputNumber: () => ({
      type: 'text',
      placeholder: formPlaceholder,
      disabled: item.disabled,
      clearable: item.clearable ?? true
    }),
    number: () => ({
      placeholder: formPlaceholder,
      disabled: item.disabled,
      class: 'w-[180px]'
    }),
    select: () => ({
      placeholder: selectPlaceholder,
      options: item.options,
      disabled: item.disabled,
      clearable: item.clearable ?? true,
      class: 'w-[180px]'
    }),
    date: () => ({
      type: item.type,
      placeholder: selectPlaceholder,
      disabled: item.disabled,
      clearable: item.clearable ?? true,
      class: 'w-[180px]'
    }),
    datetime: () => ({
      type: item.type,
      placeholder: selectPlaceholder,
      disabled: item.disabled,
      clearable: item.clearable ?? true,
      class: 'w-[180px]'
    }),
    time: () => ({
      placeholder: selectPlaceholder,
      disabled: item.disabled,
      clearable: item.clearable ?? true,
      class: 'w-[180px]'
    }),
    datetimerange: () => ({
      type: item.type,
      disabled: item.disabled,
      clearable: item.clearable ?? true,
      defaultTime: DATETIMERANGE_DEFAULT_TIME,
      valueFormat: DATETIMERANGE_VALUE_FORMAT
    }),
    switch: () => ({
      disabled: item.disabled
    }),
    radio: () => ({
      disabled: item.disabled
    }),
    checkbox: () => ({
      disabled: item.disabled
    }),
    i18nInput: () => ({
      placeholder: formPlaceholder,
      disabled: item.disabled ?? props.disabled,
      class: 'w-full'
    }),
    i18nImage: () => ({
      disabled: item.disabled ?? props.disabled,
      class: 'w-full'
    })
  };

  const defaultProps = defaultPropsBuilder[item.type]?.() ?? {};
  const extendByItem = item.componentProps ?? {};

  const mergedProps: Record<string, any> = {
    ...defaultProps,
    ...extendByItem
  };

  // datetimerange：强制值格式含毫秒，保证结束时间可落到 .999
  if (item.type === 'datetimerange') {
    const rawFormat = mergedProps.valueFormat as string | undefined;
    mergedProps.valueFormat = rawFormat && String(rawFormat).includes('SSS') ? rawFormat : DATETIMERANGE_VALUE_FORMAT;
    if (!mergedProps.defaultTime) {
      mergedProps.defaultTime = DATETIMERANGE_DEFAULT_TIME;
    }
  }

  return mergedProps;
};

/**
 * 规范化 datetimerange：结束时间毫秒固定为 .999
 */
const normalizeDatetimerangeValue = (item: FormItem, value: any) => {
  if (!Array.isArray(value) || value.length < 2 || value[1] === '' || value[1] === null || value[1] === undefined) {
    return value;
  }

  const rawFormat = (item.componentProps as { valueFormat?: string } | undefined)?.valueFormat;
  const formatWithMs = rawFormat && String(rawFormat).includes('SSS') ? rawFormat : DATETIMERANGE_VALUE_FORMAT;
  const [start, end] = value;

  const normalizeEnd = (endValue: string | Date) => {
    if (endValue instanceof Date) {
      const next = new Date(endValue);
      next.setMilliseconds(999);
      return next;
    }
    return dayjs(endValue).millisecond(999).format(formatWithMs);
  };

  const normalizeStart = (startValue: string | Date) => {
    if (startValue === '' || startValue === null || startValue === undefined) return startValue;
    if (startValue instanceof Date) return startValue;
    return dayjs(startValue).format(formatWithMs);
  };

  return [normalizeStart(start), normalizeEnd(end)];
};

/**
 * 规范化字段值
 * @param item 表单项
 * @param value 值
 * @returns 规范化后的值
 */
const normalizeFieldValue = (item: FormItem, value: any) => {
  if (item.type === 'datetimerange') {
    return normalizeDatetimerangeValue(item, value);
  }
  if (item.type !== 'inputNumber') return value;
  if (value === '' || value === null || value === undefined) return value;
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? value : numericValue;
};

/**
 * 更新字段值
 * @param item 表单项
 * @param value 值
 */
const updateFieldValue = (item: FormItem, value: any) => {
  const nextValue = normalizeFieldValue(item, value);
  formData.value[item.prop] = nextValue;

  // 通知父组件数据变化
  emit('update:modelValue', { ...formData.value });

  // i18n 组件仅 emit update:modelValue，需在此触发联动与校验
  if (isI18nFormItem(item)) {
    handleFieldChange(item.prop, nextValue, item).catch(error => {
      console.error(`字段 ${item.prop} 变化处理失败:`, error);
    });
  }
};

/**
 * 处理动态字段 change（i18n 组件内 ElInput 的 change 会冒泡到根节点，不可在此处理）
 */
const handleComponentChange = (item: FormItem, value: unknown) => {
  if (isI18nFormItem(item)) return;
  handleDynamicFieldChange(item, value);
};

/**
 * 处理动态字段变化
 * @param item 表单项
 * @param value 值
 */
const handleDynamicFieldChange = (item: FormItem, value: any) => {
  const nextValue = normalizeFieldValue(item, value ?? formData.value[item.prop]);
  handleFieldChange(item.prop, nextValue, item);
};

/**
 * 处理 autocomplete 选中
 */
const handleDynamicSelect = async (item: FormItem, picked: any) => {
  if (item.type !== 'autocomplete') return;

  await handleFieldChange(item.prop, formData.value[item.prop], item);

  if (item.onSelect) {
    try {
      await item.onSelect(picked, { ...formData.value }, item.prop);
    } catch (error) {
      console.error(`字段 ${item.prop} 的 onSelect 回调执行失败:`, error);
    }
  }
};

defineExpose({
  formRef,
  initFormData,
  validate,
  clearValidate,
  resetFields,
  getFormData: () => formData.value
});
</script>

<template>
  <ElForm ref="formRef" v-bind="formBindProps" @submit.prevent>
    <div :class="useSpanLayout ? 'grid grid-cols-1 gap-x-4 sm:grid-cols-2' : ''">
      <template v-for="item in formItems" :key="item.prop">
        <ElFormItem
          v-if="item.show !== false"
          :class="getFormItemClass(item)"
          :label="item.label"
          :prop="item.prop"
          :rules="item.rules"
        >
          <component
            :is="getComponentName(item)"
            v-if="item.type !== 'slot'"
            :model-value="formData[item.prop]"
            v-bind="getComponentProps(item)"
            @update:model-value="updateFieldValue(item, $event)"
            @change="handleComponentChange(item, $event)"
            @select="handleDynamicSelect(item, $event)"
          >
            <template v-if="item.type === 'radio'">
              <ElRadio v-for="option in item.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </ElRadio>
            </template>
            <template v-else-if="item.type === 'checkbox'">
              <ElCheckbox v-for="option in item.options" :key="option.value" :label="option.value">
                {{ option.label }}
              </ElCheckbox>
            </template>
          </component>

          <!-- 自定义插槽 -->
          <slot v-else :name="item.slotName || item.prop" :form="formData" :item="item" />
        </ElFormItem>
      </template>
    </div>
  </ElForm>
</template>
