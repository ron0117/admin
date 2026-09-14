<script setup lang="ts">
defineOptions({ name: 'DemoExampleAbout' });
</script>

<template>
  <div class="p-16px leading-6">
    <h3 class="mb-8px text-16px font-medium">框架示例页</h3>
    <p>本页用于演示 PageMenu Tab 切换与框架组件（JQSearch / JQDataTable）。</p>
    <p>权限体系已 stub：菜单、路由、指令默认全通；登录默认走本地 mock（`VITE_AUTH_MOCK=Y`）。</p>
  </div>
</template>
