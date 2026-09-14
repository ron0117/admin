<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { ElPagination } from 'element-plus';
import { useAppStore } from '@/store/modules/app';
import { formatTime } from '@/utils';

/** ElTableColumn 绑定属性（避免 InstanceType<SFCWithInstall> 在 EP 新类型下报错） */
type ElTableColumnBindProps = Record<string, any>;

export type TableColumn<T = any> = ElTableColumnBindProps & {
  /** 时间格式化 */
  formatTime?: boolean;

  // 插槽相关
  slot?: string;
  render?: (scope: { row: T; column: TableColumn; $index: number }) => any;
  headerRender?: (scope: { column: TableColumn }) => any;
  headerSlot?: string;
};

export type TPagination = {
  currentPage: number;
  pageSize: number;
  total: number;
  pageSizes?: number[];
  layout?: string;
  background?: boolean;
  small?: boolean;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  pagerCount?: number;
};

type Props<T = any> = {
  // 数据
  data?: T[];
  // 列配置
  columns?: TableColumn<T>[];
  // 加载状态
  loading?: boolean;
  // 选择列配置
  showSelection?: boolean;
  // 模块名称
  moduleName?: string;
  // 序号列配置
  showIndex?: boolean;
  // 分页配置
  pagination?: TPagination;
  // 显示分页
  showPagination?: boolean;
  // 自动高度
  autoHeight?: boolean;

  // 显示新增按钮
  showAdd?: boolean;
  // 其余透传给 ElTable
  stripe?: boolean;
  border?: boolean;
  size?: 'large' | 'default' | 'small';
  height?: string | number;
  maxHeight?: string | number;
  rowKey?: string | ((row: T) => string);
  defaultSort?: { prop: string; order: 'ascending' | 'descending' };
  emptyText?: string;
};

const appStore = useAppStore();

/*
 * 继承核心问题：Vue 的 Boolean 类型 prop 隐式默认值为 false
 */
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  loading: false,
  showSelection: false,
  showIndex: false,
  showPagination: true,
  autoHeight: false
});

defineOptions({ name: 'DataTable' });

const tableRef = ref();

const isMobile = computed(() => appStore.isMobile);

const defaultPagination = ref<TPagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100, 200],
  layout: 'total,prev,pager,next,sizes',
  background: false,
  small: false,
  disabled: false,
  hideOnSinglePage: false,
  pagerCount: 9
});

watch(
  () => props.pagination,
  newPagination => {
    if (!newPagination) return;
    defaultPagination.value = {
      ...defaultPagination.value,
      ...newPagination
    };
  },
  { deep: true, immediate: true }
);

const paginationBindProps = computed(() => {
  const { currentPage: _currentPage, pageSize: _pageSize, pagerCount: _pagerCount, ...rest } = defaultPagination.value;
  return {
    ...(rest as Record<string, unknown>),
    // mobile 显示3个页码
    pagerCount: isMobile.value ? 3 : 9
  };
});

// 计算列，过滤掉没有 label 的列
const computedColumns = computed(() => {
  return props.columns.filter(column => column.label || column.prop);
});

// 表格容器样式
const tableWrapperStyle = computed(() => {
  if (props.autoHeight) return { height: '100%', flex: 1 };
  return {};
});

const defaultTableProps: Record<string, any> = {
  fit: true,
  allowDragLastColumn: true,
  border: true,
  showHeader: true,
  emptyText: '暫無數據',
  height: '100%'
};

const tableBindProps = computed(() => {
  const {
    columns: _columns,
    loading: _loading,
    showSelection: _showSelection,
    moduleName: _moduleName,
    showIndex: _showIndex,
    pagination: _pagination,
    showPagination: _showPagination,
    autoHeight: _autoHeight,
    showAdd: _showAdd,
    data,
    ...tablePropsFromProps
  } = props;

  const normalizeValue = (value: unknown) => value !== undefined && value !== null && value !== '';
  const normalizedTableProps = Object.fromEntries(
    Object.entries(tablePropsFromProps).filter(([, value]) => normalizeValue(value))
  );

  // props 或 attrs 传值时优先使用；空值时回退默认值
  return {
    ...normalizedTableProps,
    ...defaultTableProps,
    data
  };
});

const selectionColumnBindProps = computed(() => {
  const defaultSelectionColumnProps: ElTableColumnBindProps = {
    type: 'selection',
    width: 55,
    align: 'center',
    reserveSelection: false
  };

  return {
    ...defaultSelectionColumnProps
  };
});

const indexColumnBindProps = computed(() => {
  const defaultIndexColumnProps: ElTableColumnBindProps = {
    type: 'index',
    label: '序號',
    width: 80,
    align: 'center'
  };

  return {
    ...defaultIndexColumnProps
  };
});

const getColumnBindProps = (column: TableColumn) => {
  const defaultColumnProps: ElTableColumnBindProps = {
    showOverflowTooltip: false
  };

  const {
    formatTime: _formatTime,
    slot: _slot,
    render: _render,
    headerRender: _headerRender,
    headerSlot: _headerSlot,
    ...rest
  } = column;

  return {
    ...defaultColumnProps,
    ...rest
  };
};

const getColumnProp = (column: TableColumn) => {
  const prop = getColumnBindProps(column).prop;
  return typeof prop === 'string' ? prop : '';
};

const emit = defineEmits<{
  // 新增事件
  add: [];
  // 刷新事件
  refresh: [];
  // 排序事件
  'sort-change': [sort: { prop: string; order: 'ascending' | 'descending' | null }];
  // 行点击事件
  'row-click': [row: any, column: any, event: Event];
  // 选择变化事件
  'selection-change': [selection: any[]];
  // 分页大小变化
  'page-size-change': [pageSize: number];
  // 当前页变化
  'page-change': [currentPage: number];
  // 分页变化（整合事件）
  'pagination-change': [{ currentPage: number; pageSize: number }];
}>();

const getColumnKey = (column: TableColumn, index: number) => {
  const prop = getColumnBindProps(column).prop;
  return String(prop ?? `column-${index}`);
};

const handleSortChange = (sort: {
  column?: unknown;
  prop: string | null;
  order: 'ascending' | 'descending' | null;
}) => {
  emit('sort-change', { prop: sort.prop ?? '', order: sort.order });
};

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event);
};

const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection);
};

const handleSizeChange = (size: number) => {
  defaultPagination.value.pageSize = size;
  emit('page-size-change', size);
  emit('pagination-change', {
    currentPage: defaultPagination.value.currentPage || 1,
    pageSize: size
  });
};

const handleCurrentChange = (current: number) => {
  defaultPagination.value.currentPage = current;
  emit('page-change', current);
  emit('pagination-change', {
    currentPage: current,
    pageSize: defaultPagination.value.pageSize || 10
  });
};

// 重置分页到第一页
const resetToFirstPage = () => {
  defaultPagination.value.currentPage = 1;
  emit('pagination-change', {
    currentPage: 1,
    pageSize: defaultPagination.value.pageSize || 10
  });
};

// 重新计算分页总数
const updateTotal = (total: number) => {
  defaultPagination.value.total = total;
};

// 暴露方法
defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: any, selected?: boolean) => tableRef.value?.toggleRowSelection(row, selected),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowExpansion: (row: any, expanded?: boolean) => tableRef.value?.toggleRowExpansion(row, expanded),
  setCurrentRow: (row?: any) => tableRef.value?.setCurrentRow(row),
  clearSort: () => tableRef.value?.clearSort(),
  clearFilter: () => tableRef.value?.clearFilter(),
  doLayout: () => tableRef.value?.doLayout(),
  sort: (prop: string, order: string) => tableRef.value?.sort(prop, order),
  // 分页方法
  resetToFirstPage,
  updateTotal,

  // 获取分页信息
  getPagination: () => ({ ...defaultPagination.value }),

  // 获取表格实例
  getTableInstance: () => tableRef.value
});

// 初始化时设置总数
nextTick(() => {
  if (props.showPagination) {
    updateTotal(props.data.length);
  }
});
</script>

<template>
  <ElCard class="card-wrapper sm:flex-1-hidden" body-class="ht50">
    <div class="table-container" :class="{ 'auto-height': autoHeight }">
      <div v-if="!$slots.header" class="mb-4 flex items-center justify-between">
        <p class="lt-sm:hidden">{{ moduleName }}</p>
        <ElSpace direction="horizontal" wrap justify="end" class="lt-sm:overflow-auto-x">
          <slot name="header-prefix"></slot>
          <slot name="default">
            <ElButton v-if="showAdd" plain type="primary" @click="emit('add')">
              <template #icon>
                <icon-ic-round-plus class="text-icon" />
              </template>
              {{ $t('common.add') }}
            </ElButton>
          </slot>
          <ElButton @click="emit('refresh')">
            <template #icon>
              <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            {{ $t('common.refresh') }}
          </ElButton>
          <slot name="suffix"></slot>
          <slot name="header-suffix"></slot>
        </ElSpace>
      </div>
      <!-- 表格顶部slot -->
      <slot name="header"></slot>
      <!-- 紧贴表头（列标题）上方的区域，例如店家信息 -->
      <slot name="table-top"></slot>
      <!-- 表格区域 -->
      <div class="flex-1 overflow-auto" :style="tableWrapperStyle">
        <ElTable
          ref="tableRef"
          v-loading="loading"
          class="sm:h-full"
          v-bind="tableBindProps"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <!-- 多选列 -->
          <ElTableColumn v-if="showSelection" v-bind="selectionColumnBindProps" />

          <!-- 序号列 -->
          <ElTableColumn v-if="showIndex" v-bind="indexColumnBindProps" />

          <!-- 动态列渲染 -->
          <template v-for="(column, index) in computedColumns" :key="getColumnKey(column, index)">
            <ElTableColumn v-bind="getColumnBindProps(column)">
              <!-- 自定义表头 -->
              <template v-if="column.headerRender || column.headerSlot" #header="scope">
                <template v-if="column.headerRender">
                  <component :is="column.headerRender" v-if="column.headerRender" v-bind="{ ...scope, column }" />
                </template>
                <slot v-else-if="column.headerSlot" :name="column.headerSlot" v-bind="{ ...scope, column }" />
              </template>

              <!-- 自定义内容 -->
              <template #default="scope">
                <template v-if="column.render">
                  <component :is="column.render" v-bind="{ ...scope, column }" />
                </template>
                <slot v-else-if="column.slot" :name="column.slot" v-bind="{ ...scope, column, index: scope.$index }" />
                <span v-else-if="column.formatTime && getColumnProp(column)">
                  {{ formatTime(scope.row[getColumnProp(column)]) }}
                </span>
                <span v-else-if="getColumnProp(column)">{{ scope.row[getColumnProp(column)] }}</span>
              </template>
            </ElTableColumn>
          </template>

          <!-- 额外的插槽内容 -->
          <slot />
        </ElTable>
      </div>
      <!-- 分页区域 -->
      <div v-if="showPagination" class="mt-20px flex justify-end">
        <ElPagination
          v-model:current-page="defaultPagination.currentPage"
          v-model:page-size="defaultPagination.pageSize"
          v-bind="paginationBindProps"
          class="lt-sm:w-full lt-sm:overflow-auto"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  height: 100%;
}

.auto-height {
  min-height: 300px;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
}

.el-table {
  width: 100%;
}

.el-table :deep(.cell) {
  white-space: nowrap;
}

.el-table :deep(.el-table__cell) {
  padding: 12px 0;
  box-sizing: border-box;

  .cell {
    padding: 0 8px;
  }
}
</style>
