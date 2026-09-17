<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm, JQSearch } from '@/components';
import { fetchAdminList, fetchCreateAdmin, fetchResetAdminPassword, fetchUpdateAdmin } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'ManageAdmin' });

const loading = ref(false);
const rows = ref<Api.Admin.Item[]>([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const query = reactive<{
  keyword: string;
  status: '' | Api.Admin.Status;
}>({
  keyword: '',
  status: ''
});

const formVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const editing = ref<Api.Admin.Item | null>(null);
const resetVisible = ref(false);
const resetTarget = ref<Api.Admin.Item | null>(null);

const statusOptions = computed(() => [
  { label: $t('page.manage.admin.statusActive'), value: 'active' },
  { label: $t('page.manage.admin.statusDisabled'), value: 'disabled' }
]);

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'keyword',
    label: $t('page.manage.admin.keyword'),
    type: 'input',
    placeholder: $t('page.manage.admin.form.userEmail')
  },
  {
    prop: 'status',
    label: $t('page.manage.admin.userStatus'),
    type: 'select',
    clearable: true,
    options: statusOptions.value
  }
]);

const formItems = computed<FormItem[]>(() => {
  const isCreate = formMode.value === 'create';
  return [
    {
      prop: 'email',
      label: $t('page.manage.admin.userEmail'),
      type: 'input',
      span: 2,
      rules: [{ required: true, type: 'email', message: $t('form.email.invalid'), trigger: 'blur' }]
    },
    {
      prop: 'username',
      label: $t('page.manage.admin.userName'),
      type: 'input',
      span: 2
    },
    ...(isCreate
      ? [
          {
            prop: 'password',
            label: $t('page.manage.admin.password'),
            type: 'input',
            span: 2,
            componentProps: { type: 'password', showPassword: true },
            rules: [{ required: true, min: 8, message: $t('form.pwd.invalid'), trigger: 'blur' }]
          } as FormItem
        ]
      : [])
  ];
});

const resetFormItems = computed<FormItem[]>(() => [
  {
    prop: 'password',
    label: $t('page.manage.admin.password'),
    type: 'input',
    span: 2,
    componentProps: { type: 'password', showPassword: true },
    rules: [{ required: true, min: 8, message: $t('form.pwd.invalid'), trigger: 'blur' }]
  }
]);

const columns = computed(() => [
  { prop: 'email', label: $t('page.manage.admin.userEmail'), minWidth: 200 },
  { prop: 'username', label: $t('page.manage.admin.userName'), minWidth: 120 },
  { prop: 'status', label: $t('page.manage.admin.userStatus'), minWidth: 120, slot: 'status' },
  { prop: 'createdAt', label: $t('page.manage.admin.createdAt'), minWidth: 170, formatTime: true },
  { prop: 'actions', label: $t('common.operate'), minWidth: 280, slot: 'actions', fixed: 'right' }
]);

const formTitle = computed(() =>
  formMode.value === 'create' ? $t('page.manage.admin.addUser') : $t('page.manage.admin.editUser')
);

const formInitial = computed(() => {
  if (formMode.value === 'edit' && editing.value) {
    return {
      email: editing.value.email,
      username: editing.value.username ?? ''
    };
  }
  return { email: '', username: '', password: '' };
});

const loadList = async () => {
  loading.value = true;
  const { data, error } = await fetchAdminList({
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
  query.status = (data.status as Api.Admin.Status) || '';
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

const openEdit = (row: Api.Admin.Item) => {
  formMode.value = 'edit';
  editing.value = row;
  formVisible.value = true;
};

const openReset = (row: Api.Admin.Item) => {
  resetTarget.value = row;
  resetVisible.value = true;
};

const handleFormSubmit = async (data: Record<string, string>) => {
  if (formMode.value === 'create') {
    const { error } = await fetchCreateAdmin({
      email: data.email,
      password: data.password,
      username: data.username || undefined
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.addSuccess'));
  } else if (editing.value) {
    const { error } = await fetchUpdateAdmin(editing.value.id, {
      email: data.email,
      username: data.username || null
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.updateSuccess'));
  }
  formVisible.value = false;
  await loadList();
};

const handleResetSubmit = async (data: Record<string, string>) => {
  if (!resetTarget.value) {
    return;
  }
  const { error } = await fetchResetAdminPassword(resetTarget.value.id, data.password);
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  resetVisible.value = false;
};

const patchStatus = async (row: Api.Admin.Item, status: 'active' | 'disabled') => {
  const confirmText =
    status === 'disabled' ? $t('page.manage.admin.confirmDisable') : $t('page.manage.admin.confirmEnable');
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
  const { error } = await fetchUpdateAdmin(row.id, { status });
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  await loadList();
};

const statusLabel = (status: Api.Admin.Status) =>
  status === 'active' ? $t('page.manage.admin.statusActive') : $t('page.manage.admin.statusDisabled');

const adminRow = (row: unknown) => row as Api.Admin.Item;

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
        <ElButton type="primary" plain size="small" @click="openEdit(adminRow(row))">{{ $t('common.edit') }}</ElButton>
        <ElButton type="primary" plain size="small" @click="openReset(adminRow(row))">
          {{ $t('page.manage.admin.resetPassword') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'active'"
          type="danger"
          plain
          size="small"
          @click="patchStatus(adminRow(row), 'disabled')"
        >
          {{ $t('common.disable') }}
        </ElButton>
        <ElButton v-else type="success" plain size="small" @click="patchStatus(adminRow(row), 'active')">
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
    <JQDialogForm
      v-model="resetVisible"
      :title="$t('page.manage.admin.resetPassword')"
      :form-items="resetFormItems"
      :initial-data="{ password: '' }"
      width="480px"
      :close-on-click-modal="false"
      :on-submit="handleResetSubmit"
    />
  </JQCustomPage>
</template>
