---
trigger: add-locale
description: 添加国际化文案
---

# add-locale - 添加国际化文案

在项目中添加新的国际化文案。

## 触发条件

用户需要添加国际化文案时，例如：
- "添加一个中文文案"
- "这个文本需要国际化"
- "帮我配置多语言"

## 规范要求

### 1. 文案位置
查找现有的 locale 文件位置（通常在 `src/locales/langs/` 目录）

### 2. 文案命名规范
```
page.模块名。页面名。文案描述
common.通用文案
form.表单文案
```

### 3. 添加格式
```typescript
// 中文
export default {
  page: {
    member: {
      basic: {
        title: '会员资料',
        search: '搜索会员',
        edit: '编辑会员'
      }
    }
  },
  common: {
    confirm: '确认',
    cancel: '取消',
    edit: '编辑',
    read: '查看',
    noPrivilege: '无权限'
  }
};
```

### 4. 使用方式
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div>{{ t('page.member.basic.title') }}</div>
  <ElButton>{{ t('common.confirm') }}</ElButton>
</template>
```

或使用 `$t`：
```vue
<template>
  <div>{{ $t('page.member.basic.title') }}</div>
</template>
```

## 输出

1. 在对应的 locale 文件中添加文案
2. 提供使用示例
3. 检查是否有重复的 key
