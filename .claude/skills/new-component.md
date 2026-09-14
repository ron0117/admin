---
trigger: new-component
description: 创建通用 Vue 组件
---

# new-component - 创建通用组件

创建可复用的 Vue 组件。

## 触发条件

用户需要创建可复用组件时，例如：
- "创建一个用户搜索框组件"
- "帮我写一个数据表格组件"
- "需要一个 xx 功能的弹窗组件"

## 规范要求

### 1. 组件位置
- 业务组件：`src/views/{模块}/{页面}/modules/组件名.vue`
- 通用组件：`src/components/{分类}/组件名.vue`

### 2. 组件结构
```vue
<script setup lang="ts">
import { computed, watch } from 'vue';

defineOptions({ name: '组件名称' });

// Props 定义
interface Props {
  modelValue?: string;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false
});

// Emits 定义
interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}
const emits = defineEmits<Emits>();

// 计算属性
const currentValue = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
});

// 方法
const handleClick = () => {
  emits('change', currentValue.value);
};
</script>

<template>
  <div class="component-wrapper">
    <!-- 组件内容 -->
  </div>
</template>

<style scoped>
.component-wrapper {
  /* 组件样式 */
}
</style>
```

### 3. Props 命名规范
- 使用 camelCase（驼峰命名）
- 布尔值用 `is`/`has`/`disabled` 前缀
- 必须有默认值

### 4. Emits 命名规范
- 事件名使用 camelCase
- v-model 相关事件使用 `update:xxx` 格式

### 5. 样式规范
- 组件级样式使用 `scoped`
- 复杂样式可使用 SCSS
- 简单样式优先使用 UnoCSS

## 输出

1. 创建组件文件
2. 在需要的地方导入使用
3. 添加国际化文案（如需）
