# Form 组件使用说明

对应文件：`src/components/custom/form.vue`  
组件名：`JQForm`

## 核心功能

1. 通过 `formItems` 配置动态渲染表单项。
2. 支持多种内置类型：`input`、`select`、`date`、`radio`、`checkbox`、`slot` 等。
3. 自动合并规则（`props.rules` + 每个字段的 `item.rules`）。
4. 支持 `v-model` 双向绑定和字段变更事件回调。
5. 暴露表单常用方法（校验、重置、清除校验、获取数据）。

## 基础用法

```vue
<template>
  <JQForm
    ref="formRef"
    v-model="formData"
    :form-items="formItems"
    :rules="rules"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formRef = ref();
const formData = ref({});

const formItems = [
  { prop: 'username', label: '用户名', type: 'input', clearable: true },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 }
    ]
  }
];

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
};
</script>
```

## 主要 Props

- `formItems: FormItem[]`：表单项配置（必传）。
- `modelValue?: Record<string, any>`：表单数据，配合 `v-model` 使用。
- `initialData?: Record<string, any>`：初始化数据。
- `rules?: FormRules`：全局校验规则。
- 其余 `ElForm` 属性可透传（如 `labelWidth`、`inline`、`labelPosition`）。

## FormItem 常用字段

- `prop`：字段名。
- `label`：标签名。
- `type`：组件类型（`input/select/date/...`）。
- `defaultValue`：默认值。
- `componentProps`：透传给对应组件的属性（优先级最高）。
- `options`：`radio/checkbox/select` 的选项数据。
- `show`：是否显示该项。
- `onChange(value, formData, prop)`：字段变更回调。
- `slotName`：`type = 'slot'` 时使用的插槽名。

## 事件

- `update:modelValue`：表单值更新时触发。
- `field-change`：字段变化时触发，参数：`{ prop, value, item }`。

## 暴露方法（ref 调用）

- `validate(): Promise<boolean>`：校验整个表单。
- `clearValidate()`：清除校验状态。
- `resetFields()`：重置字段并恢复初始值。
- `initFormData()`：按配置重新初始化表单数据。
- `getFormData()`：获取当前表单数据。

## 插槽

- 当 `FormItem.type = 'slot'` 时，渲染命名插槽。
- 默认插槽名为该项 `prop`，也可用 `slotName` 自定义。

