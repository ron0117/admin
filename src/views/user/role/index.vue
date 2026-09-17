<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm, JQSearch } from '@/components';
import {
  fetchCreateRole,
  fetchMenuTree,
  fetchPutRoleMenus,
  fetchRoleDetail,
  fetchRoleList,
  fetchUpdateRole
} from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'ManageRole' });

type MenuTreeInstance = {
  setCheckedKeys: (keys: string[]) => void;
  getCheckedKeys: (leafOnly?: boolean) => string[];
};

const loading = ref(false);
const rows = ref<Api.Role.Item[]>([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const query = reactive<{
  keyword: string;
  status: '' | Api.Role.Status;
}>({
  keyword: '',
  status: ''
});

const formVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const editing = ref<Api.Role.Item | null>(null);

const menuVisible = ref(false);
const menuTarget = ref<Api.Role.Item | null>(null);
const menuTree = ref<Api.Role.MenuNode[]>([]);
const menuLoading = ref(false);
const menuSaving = ref(false);
const treeRef = ref<MenuTreeInstance | null>(null);

const statusOptions = computed(() => [
  { label: $t('page.manage.role.statusActive'), value: 'active' },
  { label: $t('page.manage.role.statusDisabled'), value: 'disabled' }
]);

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'keyword',
    label: $t('page.manage.role.keyword'),
    type: 'input',
    placeholder: $t('page.manage.role.form.roleName')
  },
  {
    prop: 'status',
    label: $t('page.manage.role.roleStatus'),
    type: 'select',
    clearable: true,
    options: statusOptions.value
  }
]);

const formItems = computed<FormItem[]>(() => [
  {
    prop: 'name',
    label: $t('page.manage.role.roleName'),
    type: 'input',
    span: 2,
    rules: [{ required: true, message: $t('form.required'), trigger: 'blur' }]
  },
  {
    prop: 'remark',
    label: $t('page.manage.role.roleDesc'),
    type: 'textarea',
    span: 2
  }
]);

const columns = computed(() => [
  { prop: 'name', label: $t('page.manage.role.roleName'), minWidth: 160 },
  { prop: 'remark', label: $t('page.manage.role.roleDesc'), minWidth: 200 },
  { prop: 'status', label: $t('page.manage.role.roleStatus'), minWidth: 120, slot: 'status' },
  { prop: 'createdAt', label: $t('page.manage.role.createdAt'), minWidth: 170, formatTime: true },
  { prop: 'actions', label: $t('common.operate'), minWidth: 280, slot: 'actions', fixed: 'right' }
]);

const formTitle = computed(() =>
  formMode.value === 'create' ? $t('page.manage.role.addRole') : $t('page.manage.role.editRole')
);

const formInitial = computed(() => {
  if (formMode.value === 'edit' && editing.value) {
    return {
      name: editing.value.name,
      remark: editing.value.remark ?? ''
    };
  }
  return { name: '', remark: '' };
});

const loadList = async () => {
  loading.value = true;
  const { data, error } = await fetchRoleList({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    keyword: query.keyword || undefined,
    status: query.status || undefined
  });
  loading.value = false;
  if (error || !data) {
    return;
  }
  rows.value = data.items;
  pagination.total = data.total;
};

const handleSearch = (data: Record<string, string>) => {
  query.keyword = data.keyword || '';
  query.status = (data.status as Api.Role.Status) || '';
  pagination.currentPage = 1;
  loadList();
};

const handleReset = () => {
  query.keyword = '';
  query.status = '';
  pagination.currentPage = 1;
  loadList();
};

const openCreate = () => {
  formMode.value = 'create';
  editing.value = null;
  formVisible.value = true;
};

const openEdit = (row: Api.Role.Item) => {
  formMode.value = 'edit';
  editing.value = row;
  formVisible.value = true;
};

const handleFormSubmit = async (data: Record<string, string>) => {
  if (formMode.value === 'create') {
    const { error } = await fetchCreateRole({
      name: data.name,
      remark: data.remark || undefined
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.addSuccess'));
  } else if (editing.value) {
    const { error } = await fetchUpdateRole(editing.value.id, {
      name: data.name,
      remark: data.remark || null
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.updateSuccess'));
  }
  formVisible.value = false;
  await loadList();
};

const patchStatus = async (row: Api.Role.Item, status: Api.Role.Status) => {
  const confirmText =
    status === 'disabled' ? $t('page.manage.role.confirmDisable') : $t('page.manage.role.confirmEnable');
  try {
    await ElMessageBox.confirm(confirmText, $t('common.tip'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning',
      closeOnClickModal: false
    });
  } catch {
    return;
  }
  const { error } = await fetchUpdateRole(row.id, { status });
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  await loadList();
};

const openMenus = async (row: Api.Role.Item) => {
  menuTarget.value = row;
  menuVisible.value = true;
  menuLoading.value = true;
  const [treeRes, detailRes] = await Promise.all([fetchMenuTree(), fetchRoleDetail(row.id)]);
  menuLoading.value = false;
  if (treeRes.error || !treeRes.data || detailRes.error || !detailRes.data) {
    menuVisible.value = false;
    return;
  }
  menuTree.value = treeRes.data.items;
  await nextTick();
  treeRef.value?.setCheckedKeys(detailRes.data.menuCodes ?? []);
};

const saveMenus = async () => {
  if (!menuTarget.value) {
    return;
  }
  menuSaving.value = true;
  const codes = treeRef.value?.getCheckedKeys(false) ?? [];
  const { error } = await fetchPutRoleMenus(menuTarget.value.id, codes);
  menuSaving.value = false;
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  menuVisible.value = false;
};

const statusLabel = (status: Api.Role.Status) =>
  status === 'active' ? $t('page.manage.role.statusActive') : $t('page.manage.role.statusDisabled');

const roleRow = (row: unknown) => row as Api.Role.Item;

onMounted(() => {
  loadList();
});
</script>

<template>
  <JQCustomPage>
    <JQSearch
      :form-items="searchItems"
      show-add
      :add-text="$t('common.add')"
      @search="handleSearch"
      @reset="handleReset"
      @add="openCreate"
    />
    <JQDataTable
      :data="rows"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      class="min-h-0 flex-1"
      row-key="id"
      @pagination-change="
        ({ currentPage, pageSize }) => {
          pagination.currentPage = currentPage;
          pagination.pageSize = pageSize;
          loadList();
        }
      "
    >
      <template #status="{ row }">
        <ElTag :type="row.status === 'active' ? 'success' : 'danger'">
          {{ statusLabel(row.status) }}
        </ElTag>
      </template>
      <template #actions="{ row }">
        <ElButton type="primary" plain size="small" @click="openEdit(roleRow(row))">{{ $t('common.edit') }}</ElButton>
        <ElButton type="primary" plain size="small" @click="openMenus(roleRow(row))">
          {{ $t('page.manage.role.configureMenus') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'active'"
          type="danger"
          plain
          size="small"
          @click="patchStatus(roleRow(row), 'disabled')"
        >
          {{ $t('common.disable') }}
        </ElButton>
        <ElButton v-else type="success" plain size="small" @click="patchStatus(roleRow(row), 'active')">
          {{ $t('common.enable') }}
        </ElButton>
      </template>
    </JQDataTable>

    <JQDialogForm
      v-model="formVisible"
      :title="formTitle"
      :form-items="formItems"
      :initial-data="formInitial"
      width="560px"
      :close-on-click-modal="false"
      :on-submit="handleFormSubmit"
    />

    <ElDialog
      v-model="menuVisible"
      :title="$t('page.manage.role.configureMenus')"
      width="560px"
      :close-on-click-modal="false"
    >
      <p class="mb-12px text-13px text-gray-500">{{ $t('page.manage.role.menusHint') }}</p>
      <ElTree
        v-if="menuTree.length"
        ref="treeRef"
        v-loading="menuLoading"
        :data="menuTree"
        node-key="code"
        show-checkbox
        default-expand-all
        :props="{ label: 'name', children: 'children' }"
      />
      <template #footer>
        <ElButton @click="menuVisible = false">{{ $t('common.cancel') }}</ElButton>
        <ElButton type="primary" :loading="menuSaving" @click="saveMenus">{{ $t('common.confirm') }}</ElButton>
      </template>
    </ElDialog>
  </JQCustomPage>
</template>
