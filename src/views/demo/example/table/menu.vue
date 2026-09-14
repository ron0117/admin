<script setup lang="ts">
import { ref } from 'vue';
import type { FormItem } from '@/components';
import { JQDataTable, JQSearch } from '@/components';

defineOptions({ name: 'DemoExampleTable' });

const allRows = [
  { id: '1', name: 'Alpha', status: '启用' },
  { id: '2', name: 'Beta', status: '禁用' },
  { id: '3', name: 'Gamma', status: '启用' }
];

const rows = ref([...allRows]);

const searchItems: FormItem[] = [{ prop: 'name', label: '名称', type: 'input', placeholder: '按名称搜索' }];

const columns = [
  { prop: 'id', label: 'ID', minWidth: 100 },
  { prop: 'name', label: '名称', minWidth: 140 },
  { prop: 'status', label: '状态', minWidth: 100 }
];

function handleSearch(data: Record<string, any>) {
  const q = String(data.name || '')
    .trim()
    .toLowerCase();
  rows.value = q ? allRows.filter(item => item.name.toLowerCase().includes(q)) : [...allRows];
}

function handleReset() {
  rows.value = [...allRows];
}
</script>

<template>
  <div class="h-full min-h-0 flex flex-col gap-12px p-12px">
    <JQSearch :form-items="searchItems" @search="handleSearch" @reset="handleReset" />
    <div>
      <ElButton v-auth="'/demo'">v-auth stub</ElButton>
    </div>
    <JQDataTable :data="rows" :columns="columns" class="min-h-0 flex-1" />
  </div>
</template>
