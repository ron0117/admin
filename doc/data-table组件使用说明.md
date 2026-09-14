# DataTable 组件使用说明

对应文件：`src/components/custom/data-table.vue`  
组件名：`DataTable`

## 核心功能

1. 基于 `ElTable` 的二次封装，支持动态列配置。
2. 内置常用头部区域（新增、刷新、扩展插槽）。
3. 支持多选列、序号列、格式化时间列。
4. 支持分页并统一抛出分页变化事件。
5. 暴露表格实例常用操作方法。

## 基础用法

```vue
<template>
  <DataTable
    ref="tableRef"
    module-name="用户列表"
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :show-pagination="true"
    :pagination="pagination"
    @pagination-change="handlePaginationChange"
    @refresh="fetchData"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tableRef = ref();
const loading = ref(false);
const tableData = ref([]);

const columns = [
  { prop: 'username', label: '用户名', minWidth: 120 },
  { prop: 'createdAt', label: '创建时间', formatTime: true, minWidth: 160 }
];

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const handlePaginationChange = ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
  pagination.value.currentPage = currentPage;
  pagination.value.pageSize = pageSize;
};

const fetchData = () => {
  // 请求列表数据
};
</script>
```

## 主要 Props

- `data?: any[]`：表格数据。
- `columns?: TableColumn[]`：列配置。
- `loading?: boolean`：加载状态。
- `showSelection?: boolean`：显示多选列。
- `showIndex?: boolean`：显示序号列。
- `moduleName?: string`：头部标题。
- `showPagination?: boolean`：是否显示分页（默认 `true`）。
- `pagination?: TPagination`：分页配置（`currentPage/pageSize/total` 必填）。
- `showAdd?: boolean`：显示“新增”按钮。
- 其余 `ElTable` 属性可通过组件属性透传。

## 列配置（TableColumn）常用字段

- `prop`：字段名。
- `label`：列标题。
- `formatTime?: boolean`：是否使用 `formatTime` 格式化时间。
- `slot?: string`：单元格命名插槽。
- `render?: (scope) => any`：自定义单元格渲染。
- `headerSlot?: string`：表头命名插槽。
- `headerRender?: (scope) => any`：自定义表头渲染。

## 事件

- `add`：点击新增按钮。
- `refresh`：点击刷新按钮。
- `sort-change`：排序变化。
- `row-click`：行点击。
- `selection-change`：多选变化。
- `page-size-change`：每页条数变化。
- `page-change`：当前页变化。
- `pagination-change`：分页统一变化，参数：`{ currentPage, pageSize }`。

## 插槽

- `header`：自定义整块头部。
- `header-prefix`：头部左侧扩展。
- `default`：替换默认按钮区。
- `suffix` / `header-suffix`：头部右侧扩展。
- 列级插槽：通过列配置中的 `slot`、`headerSlot` 对应命名插槽。

## 暴露方法（ref 调用）

- 表格方法：`clearSelection`、`toggleRowSelection`、`toggleAllSelection`、`setCurrentRow`、`clearSort`、`clearFilter`、`doLayout`、`sort`。
- 分页方法：`resetToFirstPage()`、`updateTotal(total)`、`getPagination()`。
- 实例获取：`getTableInstance()`。

